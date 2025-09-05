import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Testing database connection from production...');

    // Dynamic import to avoid build-time database connection
    const { prisma } = await import('@/lib/prisma');

    // Test basic connection
    const userCount = await prisma.user.count();
    console.log(`📊 Database connection successful. Users: ${userCount}`);

    // Create a test user to verify write access
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@debug.com`,
        name: 'Debug Test User',
        role: 'CLIENT',
        emailVerified: new Date(),
      },
    });
    console.log('✅ Test user created:', testUser.id);

    // Delete the test user
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('🧹 Test user deleted');

    const response = {
      success: true,
      message: 'Database connection and operations working correctly',
      userCount,
      testUserId: testUser.id,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
    };

    console.log('📊 Debug response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Database debug test failed:', error);

    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
