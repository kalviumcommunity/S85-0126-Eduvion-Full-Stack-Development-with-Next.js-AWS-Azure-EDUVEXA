import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }


    // Debug: log user object before signing JWT
    console.log('Login user:', user);
    let token;
    try {
      token = jwt.sign(
        {
          userId: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );
    } catch (jwtError) {
      console.error('JWT sign error:', jwtError);
      return NextResponse.json(
        { message: "JWT sign error", error: jwtError instanceof Error ? jwtError.message : jwtError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login route error:', error);
    return NextResponse.json(
      { message: "Login failed", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
