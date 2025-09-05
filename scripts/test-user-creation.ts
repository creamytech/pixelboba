import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testUserCreation() {
  try {
    console.log('🧪 Testing user creation process...');

    const testEmail = 'test@example.com';
    const testName = 'Test User';

    // Simulate the auth callback process
    console.log(`📝 Attempting to create user: ${testEmail}`);

    // Check if user exists first (like in auth.ts)
    let dbUser = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (dbUser) {
      console.log('👤 User already exists:', dbUser.email);
      await prisma.user.delete({ where: { id: dbUser.id } });
      console.log('🗑️  Deleted existing test user');
    }

    // Create user (like in auth.ts signIn callback)
    dbUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: testName,
        image: 'https://example.com/avatar.jpg',
        role: 'CLIENT',
        emailVerified: new Date(),
      },
    });

    console.log('✅ User created successfully:', {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      created: dbUser.createdAt,
    });

    // Test the portal dashboard API simulation
    console.log('\n🔍 Testing portal dashboard data fetch...');

    const portalData = {
      user: {
        id: dbUser.id,
        name: dbUser.name || 'User',
        email: dbUser.email,
        role: dbUser.role,
      },
      projects: [],
      unreadMessages: 0,
      pendingInvoices: 0,
      pendingContracts: 0,
    };

    console.log('📊 Portal data would be:', portalData);

    // Clean up test user
    await prisma.user.delete({ where: { id: dbUser.id } });
    console.log('🧹 Cleaned up test user');

    console.log('\n✅ User creation test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);

    // Show more detailed error info
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5).join('\n'),
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

testUserCreation();
