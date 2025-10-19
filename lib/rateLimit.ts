/**
 * Rate Limiting Utility
 * Prevents API abuse and protects against brute force attacks
 */

import { NextRequest } from 'next/server';

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per interval
}

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store (for production, use Redis or similar)
const rateLimitStore = new Map<string, RateLimitStore>();

/**
 * Rate limiter with sliding window
 */
export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if request should be rate limited
   */
  async check(
    identifier: string
  ): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
      this.cleanup();
    }

    if (!entry || now >= entry.resetTime) {
      // First request or window expired
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + this.config.interval,
      });

      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetIn: this.config.interval,
      };
    }

    // Increment count
    entry.count += 1;

    if (entry.count > this.config.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetIn: entry.resetTime - now,
      };
    }

    // Within limit
    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetIn: entry.resetTime - now,
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now >= entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }
}

/**
 * Get identifier from request (IP or user ID)
 */
export function getIdentifier(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;

  // Get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';

  return `ip:${ip}`;
}

/**
 * Pre-configured rate limiters for different scenarios
 */
export const rateLimiters = {
  // Authentication endpoints: 5 requests per 15 minutes
  auth: new RateLimiter({
    interval: 15 * 60 * 1000,
    maxRequests: 5,
  }),

  // API endpoints: 100 requests per minute
  api: new RateLimiter({
    interval: 60 * 1000,
    maxRequests: 100,
  }),

  // File uploads: 10 uploads per 5 minutes
  upload: new RateLimiter({
    interval: 5 * 60 * 1000,
    maxRequests: 10,
  }),

  // Sensitive actions: 3 requests per 10 minutes
  sensitive: new RateLimiter({
    interval: 10 * 60 * 1000,
    maxRequests: 3,
  }),

  // Search queries: 30 requests per minute
  search: new RateLimiter({
    interval: 60 * 1000,
    maxRequests: 30,
  }),
};

/**
 * Middleware-style rate limiter
 */
export async function withRateLimit(
  request: NextRequest,
  limiter: RateLimiter,
  userId?: string
): Promise<{ success: true } | { success: false; error: string; headers: Record<string, string> }> {
  const identifier = getIdentifier(request, userId);
  const result = await limiter.check(identifier);

  if (!result.allowed) {
    return {
      success: false,
      error: 'Rate limit exceeded. Please try again later.',
      headers: {
        'X-RateLimit-Limit': limiter['config'].maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + result.resetIn).toISOString(),
        'Retry-After': Math.ceil(result.resetIn / 1000).toString(),
      },
    };
  }

  return { success: true };
}

/**
 * Example usage in API route:
 *
 * export async function POST(request: NextRequest) {
 *   const session = await getServerSession(authOptions);
 *
 *   // Rate limit check
 *   const rateLimitResult = await withRateLimit(
 *     request,
 *     rateLimiters.sensitive,
 *     session?.user?.id
 *   );
 *
 *   if (!rateLimitResult.success) {
 *     return NextResponse.json(
 *       { error: rateLimitResult.error },
 *       {
 *         status: 429,
 *         headers: rateLimitResult.headers,
 *       }
 *     );
 *   }
 *
 *   // Process request...
 * }
 */
