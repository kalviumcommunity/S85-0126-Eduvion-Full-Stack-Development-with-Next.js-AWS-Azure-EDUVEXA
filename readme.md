# EDUVEXA

## 📘 Project Overview

**EDUVEXA** is a modern, full-stack educational collaboration platform designed to improve visibility into student engagement and project progress. It leverages dashboards, peer feedback mechanisms, and analytics to enhance collaboration, accountability, and learning outcomes.

The project is built using an **industry-grade full-stack architecture** with Next.js, PostgreSQL, Prisma, Redis, Docker, and cloud deployment on AWS or Azure.

---

## ❗ Problem Statement

Educational institutions often lack real-time visibility into how students engage with learning activities and collaborative projects. Instructors typically discover issues—such as low participation, uneven team contributions, or delayed progress—only after final evaluations. Students, in turn, lack clarity about their own performance, peer contributions, and areas for improvement.

This lack of transparency leads to:

* Poor collaboration in group projects
* Delayed instructor intervention
* Reduced student motivation
* Weaker learning outcomes

---

## 💡 Solution

EDUVEXA solves these challenges by combining **real-time dashboards** with **structured peer feedback mechanisms**. The platform provides continuous insight into engagement and progress while enabling students to actively participate in each other’s learning journey.

---

## 🧩 Key Features

### 📊 Engagement & Progress Dashboards

* Real-time tracking of student activity
* Visual indicators for task completion and milestones
* Individual and team-level analytics

### 🤝 Peer Feedback System

* Structured peer reviews
* Qualitative and quantitative feedback
* Encourages reflection and collaborative improvement

### 🧑‍🏫 Instructor Insights

* Early detection of disengaged students
* Data-driven decision-making
* Support for timely guidance and intervention

### 🔐 Secure Role-Based Access

* Separate roles for Students, Instructors, and Admins
* Secure authentication and authorization

---

## 🚀 Tech Stack – Sprint #1

### 🖥️ Frontend

* **Next.js** (React-based full-stack framework)
* **React.js**
* **TypeScript**
* **HTML5 / CSS3**

### ⚙️ Backend

* **Next.js API Routes**
* **Node.js**

### 🗄️ Database

* **PostgreSQL** (Relational database)

### 🔗 ORM

* **Prisma ORM** (Type-safe database access)

### ⚡ Caching Layer

* **Redis** (In-memory caching & session management)

### 🐳 Containerization

* **Docker** (Environment consistency across systems)

### ☁️ Cloud & Deployment

* **AWS** or **Microsoft Azure**

### 🔄 CI/CD

* **GitHub Actions** (Automated build, test, and deployment)

---

## 🔁 System Architecture

**Next.js (UI + API Routes)**
↕
**Prisma ORM**
↕
**PostgreSQL Database**
↕
**Redis (Caching Layer)**
↕
**Docker (Containerization)**
↕
**AWS / Azure (Deployment & Scaling)**

---

## 🛠️ Use Cases

* Universities running project-based learning courses
* Colleges managing collaborative assignments
* Online education platforms
* Instructors handling large classrooms

---

## 🔮 Future Enhancements

* AI-powered feedback suggestions
* Predictive analytics for student performance
* LMS integration (Moodle, Canvas, etc.)
* Gamification features for motivation

---

## 🎯 Learning Outcomes

By working on EDUVEXA, developers gain hands-on experience with:

* Full-stack development using Next.js
* Database design with PostgreSQL & Prisma
* Performance optimization using Redis
* Containerization with Docker
* CI/CD pipelines with GitHub Actions
* Cloud deployment on AWS/Azure

---

## 📌 Conclusion

EDUVEXA reflects how **real-world, production-ready full-stack applications** are built. It not only improves educational collaboration but also mirrors modern industry practices, preparing developers for professional full-stack roles.

> *“You’re not just building an app —  you’re learning how the modern web runs.”*






## 🔐 Environment Variable Management

This project uses environment variables to manage sensitive configuration securely.

### Environment Files
- `.env.local` – Stores actual secrets and local credentials (never committed)
- `.env.example` – Template showing required variables and their purpose

### Variables Used

#### Server-side only
- `DATABASE_URL`
  - PostgreSQL connection string
  - Accessible only on the server

#### Client-side safe
- `NEXT_PUBLIC_API_BASE_URL`
  - Base URL for API requests
  - Safe to expose to the client

### Setup Instructions
1. Copy `.env.example` to `.env.local`
2. Replace placeholder values with real credentials
3. Restart the development server

### Common Pitfalls Avoided
- Never exposing secrets without `NEXT_PUBLIC_`
- Preventing `.env.local` from being committed
- Separating client and server variables clearly

