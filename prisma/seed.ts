import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Seed Users (safe to run multiple times)
  await prisma.user.createMany({
    data: [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
      { name: 'Aman', email: 'aman@gmail.com' },
    ],
    skipDuplicates: true,
  });

  console.log('Users seeded');

  // 2️⃣ Fetch users (needed for relations)
  const alice = await prisma.user.findUnique({
    where: { email: 'alice@example.com' },
  });

  if (!alice) {
    throw new Error('Alice not found');
  }

  await prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        title: 'Prisma Learning Project',
        description: 'Project created using transaction',
        ownerId: alice.id,
      },
    });

    // Create tasks under the project
    await tx.task.createMany({
      data: [
        {
          title: 'Learn Prisma Transactions',
          projectId: project.id,
        },
        {
          title: 'Understand Rollbacks',
          projectId: project.id,
        },
      ],
    });

    console.log('Project and tasks created in transaction');
  });

  console.log('Seed completed successfully');
}

// Run seed
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
