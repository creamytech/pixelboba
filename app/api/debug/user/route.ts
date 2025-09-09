import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log('Debug - Session:', {
      exists: !!session,
      user: session?.user,
      expires: session?.expires,
    });

    if (!session?.user?.email) {
      return NextResponse.json({
        error: 'No session found',
        session: null,
        timestamp: new Date().toISOString(),
      });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          isOnline: true,
          lastActiveAt: true,
        },
      });

      console.log('Debug - DB User:', dbUser);

      return NextResponse.json({
        session: {
          user: session.user,
          expires: session.expires,
        },
        dbUser,
        timestamp: new Date().toISOString(),
        success: true,
      });
    } catch (dbError) {
      console.error('Database error in debug:', dbError);
      return NextResponse.json(
        {
          error: 'Database error',
          dbError: dbError instanceof Error ? dbError.message : String(dbError),
          session: {
            user: session.user,
            expires: session.expires,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
