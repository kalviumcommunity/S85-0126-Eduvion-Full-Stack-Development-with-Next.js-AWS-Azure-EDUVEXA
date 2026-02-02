import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1️⃣ Seed Users with hashed passwords
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const users = await prisma.user.createMany({
    data: [
      { 
        name: 'Alice Johnson', 
        email: 'alice@example.com',
        password: hashedPassword,
        role: 'STUDENT',
        bio: 'Computer science student passionate about web development'
      },
      { 
        name: 'Bob Smith', 
        email: 'bob@example.com',
        password: hashedPassword,
        role: 'INSTRUCTOR',
        bio: 'Experienced software engineering instructor'
      },
      { 
        name: 'Aman Kumar', 
        email: 'aman@example.com',
        password: hashedPassword,
        role: 'STUDENT',
        bio: 'Full-stack developer in training'
      },
      { 
        name: 'Sarah Williams', 
        email: 'sarah@example.com',
        password: hashedPassword,
        role: 'STUDENT',
        bio: 'UI/UX design enthusiast'
      },
      { 
        name: 'David Chen', 
        email: 'david@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        bio: 'Platform administrator'
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${users.count} users`);

  // 2️⃣ Fetch users for relations
  const alice = await prisma.user.findUnique({
    where: { email: 'alice@example.com' },
  });
  
  const bob = await prisma.user.findUnique({
    where: { email: 'bob@example.com' },
  });
  
  const aman = await prisma.user.findUnique({
    where: { email: 'aman@example.com' },
  });

  if (!alice || !bob || !aman) {
    throw new Error('Required users not found');
  }

  // 3️⃣ Create Projects
  const projects = await prisma.project.createMany({
    data: [
      {
        title: 'E-Commerce Platform',
        description: 'Build a modern e-commerce platform with React and Node.js',
        status: 'ACTIVE',
        ownerId: bob.id,
      },
      {
        title: 'Task Management System',
        description: 'Collaborative task management tool for teams',
        status: 'ACTIVE',
        ownerId: alice.id,
      },
      {
        title: 'Learning Dashboard',
        description: 'Analytics dashboard for tracking student progress',
        status: 'ACTIVE',
        ownerId: bob.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${projects.count} projects`);

  // 4️⃣ Fetch projects for task creation
  const ecommerceProject = await prisma.project.findFirst({
    where: { title: 'E-Commerce Platform' },
  });
  
  const taskProject = await prisma.project.findFirst({
    where: { title: 'Task Management System' },
  });

  if (!ecommerceProject || !taskProject) {
    throw new Error('Required projects not found');
  }

  // 5️⃣ Create Tasks
  const tasks = await prisma.task.createMany({
    data: [
      // E-Commerce Project Tasks
      {
        title: 'Design database schema',
        description: 'Create the database schema for products, users, and orders',
        status: 'COMPLETED',
        projectId: ecommerceProject.id,
        assignedTo: alice.id,
      },
      {
        title: 'Implement user authentication',
        description: 'Add JWT-based authentication system',
        status: 'IN_PROGRESS',
        projectId: ecommerceProject.id,
        assignedTo: aman.id,
      },
      {
        title: 'Build product catalog',
        description: 'Create product listing and detail pages',
        status: 'PENDING',
        projectId: ecommerceProject.id,
        assignedTo: alice.id,
      },
      // Task Management System Tasks
      {
        title: 'Setup project structure',
        description: 'Initialize Next.js project with TypeScript',
        status: 'COMPLETED',
        projectId: taskProject.id,
        assignedTo: alice.id,
      },
      {
        title: 'Create task components',
        description: 'Build reusable task card and list components',
        status: 'IN_PROGRESS',
        projectId: taskProject.id,
        assignedTo: aman.id,
      },
      {
        title: 'Implement drag and drop',
        description: 'Add drag-and-drop functionality for task reordering',
        status: 'PENDING',
        projectId: taskProject.id,
        assignedTo: alice.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${tasks.count} tasks`);

  // 6️⃣ Create Feedback
  const feedback = await prisma.feedback.createMany({
    data: [
      {
        fromUserId: bob.id,
        toUserId: alice.id,
        rating: 5,
        comment: 'Excellent work on the database design!',
        category: 'technical',
      },
      {
        fromUserId: alice.id,
        toUserId: aman.id,
        rating: 4,
        comment: 'Great progress on authentication system',
        category: 'collaboration',
      },
      {
        fromUserId: aman.id,
        toUserId: alice.id,
        rating: 5,
        comment: 'Very helpful with project setup',
        category: 'communication',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${feedback.count} feedback entries`);

  // 7️⃣ Create Activity Logs
  const activityLogs = await prisma.activityLog.createMany({
    data: [
      {
        userId: alice.id,
        action: 'login',
        metadata: { timestamp: new Date().toISOString() },
      },
      {
        userId: alice.id,
        action: 'task_completed',
        metadata: { taskId: 1, taskTitle: 'Design database schema' },
      },
      {
        userId: bob.id,
        action: 'project_created',
        metadata: { projectId: 1, projectTitle: 'E-Commerce Platform' },
      },
      {
        userId: aman.id,
        action: 'feedback_given',
        metadata: { feedbackId: 3, rating: 5 },
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${activityLogs.count} activity logs`);

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📝 Test Accounts:');
  console.log('Student: alice@example.com / password123');
  console.log('Instructor: bob@example.com / password123');
  console.log('Admin: david@example.com / password123');
}

// Run seed
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('❌ Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
