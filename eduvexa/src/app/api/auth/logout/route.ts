
import { NextResponse } from 'next/server';

export async function POST() {
  // Create a response and clear the auth cookie (adjust cookie name as needed)
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });
  return response;
}

// Optionally support GET for logout (if your frontend uses GET)
export async function GET() {
  return POST();
}
