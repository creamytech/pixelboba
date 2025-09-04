import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createOwner() {
  const email = process.argv[2];
  const name = process.argv[3];

  if (!email || !name) {
    console.error('Usage: tsx scripts/create-owner.ts <email> <name>');
    console.error('Example: tsx scripts/create-owner.ts john@example.com "John Doe"');
    process.exit(1);
  }

  try {
    const owner = await prisma.user.create({
      data: {
        email,
        name,
        role: 'OWNER',
        emailVerified: new Date(),
      },
    });

    console.log('✅ Created owner user:');
    console.log(`   Email: ${owner.email}`);
    console.log(`   Name: ${owner.name}`);
    console.log(`   Role: ${owner.role}`);
    console.log(`   ID: ${owner.id}`);
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.error('❌ User with this email already exists');

      // Try to update existing user to OWNER
      console.log('🔄 Updating existing user to OWNER role...');
      const updated = await prisma.user.update({
        where: { email },
        data: { role: 'OWNER' },
      });
      console.log('✅ Updated user to OWNER role:', updated.email);
    } else {
      console.error('❌ Error creating owner:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createOwner();
