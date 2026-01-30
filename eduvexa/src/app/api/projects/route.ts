import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withRBAC } from "@/middleware/rbac";

// GET: List all projects
export const GET = withRBAC("read", async (req) => {
  try {
    const projects = await prisma.project.findMany();
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
});

// POST: Create a new project
export const POST = withRBAC("create", async (req) => {
  try {
    const { title, description, team, deadline, status } = await req.json();
    const project = await prisma.project.create({
      data: {
        title,
        description,
        team,
        deadline,
        status,
      },
    });
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
});

// You can add PUT and DELETE handlers for update and delete functionality as needed.
