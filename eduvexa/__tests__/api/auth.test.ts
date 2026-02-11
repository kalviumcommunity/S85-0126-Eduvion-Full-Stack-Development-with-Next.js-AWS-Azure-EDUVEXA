import { POST as handleLogin } from '@/app/api/auth/login/route';
import { POST as handleSignup } from '@/app/api/auth/signup/route';
import { POST as handleLogout } from '@/app/api/auth/logout/route';

// Mock Prisma Client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password, hash) => Promise.resolve(password === hash.replace('hashed_', ''))),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'test_token'),
  verify: jest.fn(() => ({ userId: '1', role: 'student' })),
}));

describe('Authentication API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user with valid credentials', async () => {
      const mockPrisma = require('@/lib/prisma').prisma;
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({
        id: '1',
        email: 'test@example.com',
        role: 'student',
      });

      const req = new Request('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        }),
      });

      const response = await handleSignup(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it('should reject duplicate email addresses', async () => {
      const mockPrisma = require('@/lib/prisma').prisma;
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: '1',
        email: 'existing@example.com',
      });

      const req = new Request('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'existing@example.com',
          password: 'password123',
          name: 'Test User',
        }),
      });

      const response = await handleSignup(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should reject invalid email format', async () => {
      const req = new Request('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User',
        }),
      });

      const response = await handleSignup(req);
      const data = await response.json();

      expect(response.status).toBe(400);
    });

    it('should reject weak passwords', async () => {
      const req = new Request('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: '123',
          name: 'Test User',
        }),
      });

      const response = await handleSignup(req);
      const data = await response.json();

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return auth token for valid credentials', async () => {
      const mockPrisma = require('@/lib/prisma').prisma;
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: '1',
        email: 'test@example.com',
        password: 'hashed_password123',
        role: 'student',
      });

      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      const response = await handleLogin(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.token).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const mockPrisma = require('@/lib/prisma').prisma;
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'password123',
        }),
      });

      const response = await handleLogin(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it('should reject requests with missing fields', async () => {
      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      });

      const response = await handleLogin(req);
      const data = await response.json();

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear auth token and return success', async () => {
      const req = new Request('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test_token',
        },
      });

      const response = await handleLogout(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should reject requests without authorization token', async () => {
      const req = new Request('http://localhost:3000/api/auth/logout', {
        method: 'POST',
      });

      const response = await handleLogout(req);
      const data = await response.json();

      expect(response.status).toBe(401);
    });
  });
});
