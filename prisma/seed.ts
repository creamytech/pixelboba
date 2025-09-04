import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create owner user
  const owner = await prisma.user.upsert({
    where: { email: 'your-email@example.com' }, // Replace with your email
    update: {},
    create: {
      email: 'your-email@example.com', // Replace with your email
      name: 'Your Name', // Replace with your name
      role: 'OWNER',
      emailVerified: new Date(),
    },
  });

  console.log('Created owner user:', owner);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
