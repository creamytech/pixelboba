import { NextRequest, NextResponse } from 'next/server';
import { runAllAutomations } from '@/lib/automation';

/**
 * API endpoint to trigger automation workflows
 * This can be called manually or via a cron job (e.g., Vercel Cron or external service)
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Add API key authentication for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[API] Running automation workflows...');

    const results = await runAllAutomations();

    return NextResponse.json({
      success: true,
      results,
      message: 'Automation workflows completed successfully',
    });
  } catch (error) {
    console.error('[API] Automation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for manual testing
 */
export async function GET(request: NextRequest) {
  try {
    // Check if request is from admin (you can add more auth here)
    const results = await runAllAutomations();

    return NextResponse.json({
      success: true,
      results,
      message: 'Automation workflows completed successfully',
    });
  } catch (error) {
    console.error('[API] Automation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
