# EDUVEXA

EDUVEXA is a modern, full-stack educational collaboration platform designed to improve visibility into student engagement and project progress. It leverages dashboards, peer feedback mechanisms, and analytics to enhance collaboration, accountability, and learning outcomes.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EDUVEXA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your database URL in `.env.local`:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/eduvexa"
   JWT_SECRET="your-secret-key-here"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database with test data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Test Accounts

After seeding the database, you can use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Student | alice@example.com | password123 |
| Instructor | bob@example.com | password123 |
| Admin | david@example.com | password123 |

## 🧩 Key Features

- **📊 Real-time Dashboard** - Engagement metrics, task tracking, and activity monitoring
- **🤝 Peer Feedback System** - Structured reviews with ratings and comments
- **👥 Team Management** - User profiles, search, and statistics
- **🚀 Project Management** - Task tracking with progress visualization
- **🔐 Secure Authentication** - JWT-based auth with role-based access control
- **🎨 Modern UI/UX** - Dark mode, responsive design, and smooth animations

## �️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies, bcrypt
- **UI**: Custom components with Lucide React icons

## 📁 Project Structure

```
EDUVEXA/
├── eduvexa/                    # Next.js app
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── api/          # API routes
│   │   │   ├── dashboard/    # Dashboard page
│   │   │   ├── profile/      # Profile page
│   │   │   ├── users/        # Team members page
│   │   │   ├── projects/     # Projects page
│   │   │   └── ...
│   │   ├── components/        # Reusable components
│   │   ├── context/          # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   └── lib/              # Utilities
│   └── ...
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Database migrations
│   └── seed.ts              # Seed data
├── .env.example              # Environment variables template
└── README.md                # This file
```

## 🎯 Learning Outcomes

By working on EDUVEXA, developers gain hands-on experience with:
- Full-stack Next.js development with App Router
- TypeScript for type safety
- Prisma ORM for database operations
- JWT authentication and security best practices
- Modern React patterns (Context, Hooks, Forms)
- Responsive design with Tailwind CSS
- Database design and relationships
- API development with Next.js API routes

---

> *"You're not just building an app — you're learning how the modern web runs."*
