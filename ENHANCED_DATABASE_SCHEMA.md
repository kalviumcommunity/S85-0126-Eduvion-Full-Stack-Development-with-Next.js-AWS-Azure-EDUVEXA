# EDUVEXA Enhanced Database Schema

This document outlines the enhanced database schema required to support all the new features for EDUVEXA's transformation into a comprehensive educational collaboration platform.

---

## 🗄️ Enhanced Prisma Schema

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "library"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Enums
enum UserRole {
  STUDENT
  INSTRUCTOR
  ADMIN
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  OVERDUE
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum FeedbackCategory {
  COLLABORATION
  TECHNICAL
  COMMUNICATION
  INITIATIVE
  QUALITY
  TIME_MANAGEMENT
}

enum NotificationType {
  MENTION
  FEEDBACK
  ACHIEVEMENT
  ALERT
  TEAM_UPDATE
  DEADLINE
  COMMENT
  ANNOUNCEMENT
}

enum NotificationPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum BadgeCategory {
  ACHIEVEMENT
  SKILL
  COLLABORATION
  MILESTONE
  STREAK
}

enum BadgeRarity {
  COMMON
  RARE
  EPIC
  LEGENDARY
}

enum ReportType {
  STUDENT_PERFORMANCE
  TEAM_PERFORMANCE
  CLASS_OVERVIEW
  ENGAGEMENT_ANALYTICS
  FEEDBACK_SUMMARY
}

// Enhanced User Model
model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  password  String
  role      UserRole  @default(STUDENT)
  bio       String?
  avatar    String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Gamification
  level           Int      @default(1)
  totalXP         Int      @default(0)
  currentStreak   Int      @default(0)
  longestStreak   Int      @default(0)
  lastActiveDate  DateTime @default(now())

  // Relations
  ownedProjects      Project[]
  assignedTasks      Task[]           @relation("TaskAssignee")
  feedbackGiven      Feedback[]       @relation("FeedbackFrom")
  feedbackReceived   Feedback[]       @relation("FeedbackTo")
  activityLogs       ActivityLog[]
  notifications      Notification[]
  userBadges         UserBadge[]
  teamMemberships    TeamMember[]
  discussionComments DiscussionComment[]
  discussionThreads  DiscussionThread[]
  reports            Report[]         @relation("ReportCreator")
  interventionLogs   InterventionLog[]
  workloadEntries    WorkloadEntry[]
  skillProgress      SkillProgress[]
  goalEntries        GoalEntry[]

  @@index([email])
  @@index([role])
  @@index([level])
  @@index([totalXP])
}

// Enhanced Project Model
model Project {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  status      String    @default("ACTIVE")
  startDate   DateTime  @default(now())
  endDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Project Metrics
  totalTasks        Int @default(0)
  completedTasks    Int @default(0)
  averageScore      Float?
  engagementScore   Float?

  // Relations
  ownerId Int
  owner   User   @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  tasks   Task[]
  teams   Team[]
  reports Report[] @relation("ProjectReports")

  @@index([ownerId])
  @@index([status])
}

// Enhanced Task Model
model Task {
  id          Int          @id @default(autoincrement())
  title       String
  description String?
  status      TaskStatus   @default(PENDING)
  priority    TaskPriority @default(MEDIUM)
  dueDate     DateTime?
  estimatedHours Int?
  actualHours    Int?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  // Relations
  projectId   Int
  project     Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignedTo  Int?
  assignee    User?      @relation("TaskAssignee", fields: [assignedTo], references: [id])
  comments    TaskComment[]
  attachments TaskAttachment[]

  @@index([projectId])
  @@index([status])
  @@index([assignedTo])
  @@index([dueDate])
}

// Task Comments
model TaskComment {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  taskId Int
  task   Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  authorId Int
  author   User @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([taskId])
  @@index([authorId])
}

// Task Attachments
model TaskAttachment {
  id        Int      @id @default(autoincrement())
  filename  String
  fileUrl   String
  fileSize  Int
  mimeType  String
  createdAt DateTime @default(now())

  // Relations
  taskId Int
  task   Task @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@index([taskId])
}

// Enhanced Feedback Model
model Feedback {
  id        Int              @id @default(autoincrement())
  rating    Int              // 1-5
  comment   String
  category  FeedbackCategory
  anonymous Boolean          @default(false)
  createdAt DateTime         @default(now())

  // Relations
  fromUserId Int
  fromUser   User   @relation("FeedbackFrom", fields: [fromUserId], references: [id], onDelete: Cascade)
  
  toUserId   Int
  toUser     User   @relation("FeedbackTo", fields: [toUserId], references: [id], onDelete: Cascade)

  @@index([fromUserId])
  @@index([toUserId])
  @@index([category])
}

// Enhanced Activity Log Model
model ActivityLog {
  id        Int      @id @default(autoincrement())
  action    String   // login, task_completed, feedback_given, badge_earned, etc.
  metadata  Json?    // Additional data about the action
  xpEarned  Int?     // XP earned from this activity
  createdAt DateTime @default(now())

  // Relations
  userId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([action])
  @@index([createdAt])
}

// Badge System
model Badge {
  id          Int          @id @default(autoincrement())
  name        String
  description String
  icon        String       // Emoji or icon identifier
  category    BadgeCategory
  rarity      BadgeRarity
  xpReward    Int
  requirements Json?       // Conditions to earn this badge
  createdAt   DateTime     @default(now())

  // Relations
  userBadges UserBadge[]

  @@index([category])
  @@index([rarity])
}

model UserBadge {
  id        Int      @id @default(autoincrement())
  earnedAt  DateTime @default(now())
  progress  Int?     // Progress towards earning badge (for incomplete badges)

  // Relations
  userId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
  badgeId Int
  badge   Badge @relation(fields: [badgeId], references: [id], onDelete: Cascade)

  @@unique([userId, badgeId])
  @@index([userId])
  @@index([badgeId])
}

// Team System
model Team {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  projectId Int
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  members   TeamMember[]
  discussions DiscussionThread[]

  @@index([projectId])
}

model TeamMember {
  id         Int      @id @default(autoincrement())
  role       String   @default("member") // lead, member
  joinedAt   DateTime @default(now())

  // Relations
  teamId Int
  team   Team @relation(fields: [teamId], references: [id], onDelete: Cascade)
  userId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([teamId, userId])
  @@index([teamId])
  @@index([userId])
}

// Discussion System
model DiscussionThread {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  tags      String[] // Array of tag strings
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  authorId Int
  author   User @relation(fields: [authorId], references: [id], onDelete: Cascade)
  teamId   Int?
  team     Team? @relation(fields: [teamId], references: [id], onDelete: Cascade)
  comments DiscussionComment[]

  @@index([authorId])
  @@index([teamId])
}

model DiscussionComment {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  threadId Int
  thread   DiscussionThread @relation(fields: [threadId], references: [id], onDelete: Cascade)
  authorId Int
  author   User @relation(fields: [authorId], references: [id], onDelete: Cascade)
  parentId Int?
  parent   DiscussionComment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies  DiscussionComment[] @relation("CommentReplies")

  @@index([threadId])
  @@index([authorId])
  @@index([parentId])
}

// Notification System
model Notification {
  id          Int                @id @default(autoincrement())
  title       String
  message     String
  type        NotificationType
  priority    NotificationPriority @default(MEDIUM)
  read        Boolean             @default(false)
  actionUrl   String?
  actionText  String?
  metadata    Json?
  createdAt   DateTime            @default(now())
  readAt      DateTime?

  // Relations
  userId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([read])
  @@index([type])
  @@index([priority])
  @@index([createdAt])
}

// Reporting System
model Report {
  id          Int       @id @default(autoincrement())
  type        ReportType
  title       String
  description String?
  data        Json      // Report data in JSON format
  timeRange   String    // week, month, semester, etc.
  generatedAt DateTime  @default(now())

  // Relations
  creatorId Int
  creator   User @relation("ReportCreator", fields: [creatorId], references: [id], onDelete: Cascade)
  projectId Int?
  project   Project? @relation("ProjectReports", fields: [projectId], references: [id], onDelete: Cascade)

  @@index([creatorId])
  @@index([type])
  @@index([projectId])
}

// Intervention System
model InterventionLog {
  id          Int      @id @default(autoincrement())
  type        String   // email, meeting, phone, etc.
  reason      String   // Why intervention was needed
  outcome     String   // successful, pending, unsuccessful
  notes       String?
  createdAt   DateTime @default(now())

  // Relations
  instructorId Int
  instructor   User @relation(fields: [instructorId], references: [id], onDelete: Cascade)
  studentId    Int
  student      User @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@index([instructorId])
  @@index([studentId])
}

// Workload Tracking
model WorkloadEntry {
  id          Int      @id @default(autoincrement())
  date        DateTime @default(now())
  hoursSpent  Float
  taskId      Int?
  description String?

  // Relations
  userId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([date])
}

// Skill Progress Tracking
model SkillProgress {
  id          Int      @id @default(autoincrement())
  skillName   String
  currentLevel Int     @default(0)
  targetLevel Int     @default(100)
  trend       String   @default("stable") // up, down, stable
  lastUpdated DateTime @default(now())

  // Relations
  userId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, skillName])
  @@index([userId])
}

// Goal Setting
model GoalEntry {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  targetValue Int
  currentValue Int @default(0)
  unit        String?
  deadline    DateTime?
  status      String   @default("active") // active, completed, paused
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  userId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([status])
  @@index([deadline])
}
```

---

## 📊 Key Schema Enhancements

### 1. **Gamification System**
- **Badge System**: Complete badge earning and tracking
- **XP & Levels**: User progression with streaks
- **Achievements**: Structured achievement tracking

### 2. **Enhanced Collaboration**
- **Team Management**: Multi-member teams with roles
- **Discussion Threads**: Nested comments with mentions
- **File Attachments**: Task and discussion attachments

### 3. **Advanced Analytics**
- **Activity Logging**: Detailed activity tracking with XP
- **Skill Progress**: Individual skill development tracking
- **Workload Management**: Time tracking and workload balancing

### 4. **Intervention System**
- **At-Risk Detection**: Structured intervention logging
- **Communication Tracking**: Email, meeting, phone logs
- **Outcome Tracking**: Intervention effectiveness monitoring

### 5. **Notification System**
- **Multi-type Notifications**: Mentions, feedback, achievements, alerts
- **Priority Levels**: Urgent, high, medium, low priority
- **Actionable Notifications**: Direct links to relevant content

### 6. **Reporting System**
- **Comprehensive Reports**: Student, team, class performance
- **Export Capabilities**: PDF and CSV generation
- **Time-based Analytics**: Week, month, semester views

---

## 🔍 Performance Optimizations

### Indexes Added:
- User performance indexes (level, XP, role)
- Task management indexes (status, assignee, due date)
- Feedback analytics indexes (category, ratings)
- Activity logging indexes (user, action, timestamp)
- Notification system indexes (read status, type, priority)

### Relationships:
- Proper foreign key constraints with cascading deletes
- Unique constraints where appropriate
- Optimized join queries through strategic indexing

---

## 🚀 Migration Strategy

### Phase 1: Core Tables
1. Extend existing User model with gamification fields
2. Enhance Project and Task models
3. Add ActivityLog enhancements

### Phase 2: Social Features
1. Implement Badge system
2. Add Team and Discussion models
3. Create Notification system

### Phase 3: Analytics & Reporting
1. Add SkillProgress and WorkloadEntry
2. Implement InterventionLog
3. Create Report system

### Phase 4: Advanced Features
1. Add GoalEntry system
2. Implement file attachments
3. Add advanced analytics tables

---

## 📈 Scalability Considerations

### Database Design:
- Normalized structure for data integrity
- Strategic denormalization for performance
- Partitioning strategy for large tables (ActivityLog, Notification)

### Caching Strategy:
- Redis for session management
- Cache frequently accessed user data
- Cache leaderboard and analytics data

### Performance Monitoring:
- Query performance tracking
- Index usage analysis
- Connection pooling optimization

---

## 🔐 Security Enhancements

### Data Protection:
- Sensitive data encryption
- Audit trails for all modifications
- Role-based access control enforcement

### Privacy Features:
- Anonymous feedback options
- Data retention policies
- GDPR compliance considerations

---

This enhanced schema provides a robust foundation for EDUVEXA's transformation into a comprehensive educational collaboration platform with advanced analytics, gamification, and collaboration features.
