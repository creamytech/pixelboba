import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Checking database connection...');

    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Count users
    const userCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${userCount}`);

    if (userCount > 0) {
      console.log('\n👥 Users found:');
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.role}) - ${user.name}`);
        console.log(`   ID: ${user.id}, Created: ${user.createdAt.toISOString()}`);
      });
    } else {
      console.log('⚠️  No users found in database');
    }

    // Check projects
    const projectCount = await prisma.project.count();
    console.log(`\n📁 Total projects: ${projectCount}`);

    // Check messages
    const messageCount = await prisma.message.count();
    console.log(`💬 Total messages: ${messageCount}`);

    // Check activities
    const activityCount = await prisma.activity.count();
    console.log(`📝 Total activities: ${activityCount}`);
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
