import { GET as getUser, PUT as updateUser } from '@/app/api/user/route';

// Mock Prisma Client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn((token) => ({
    userId: '1',
    role: 'student',
  })),
}));

describe('User API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/user', () => {
    it('should return authenticated user profile', async () => {
      const mockPrisma = require('@/lib/prisma').prisma;
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'student',
        bio: 'Test bio',
        avatar: null,
      });

      const req = new Request('http://localhost:3000/api/user', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test_token',
        },
      });

      const response = await getUser(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toBeDefined();
      expect(data.user.id).toBe('1');
      expect(data.user.email).toBe('test@example.com');
    });

    it('should reject requests without authorization', async () => {
      const req = new Request('http://localhost:3000/api/user', {
        method: 'GET',
      });

      const response = await getUser(req);
      const data = await response.json();

      expect(response.status).toBe(401);
    });

    it('should return 404 if user not found', async () => {
      const mockPrisma = require('@/lib/prisma').prisma;
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const req = new Request('http://localhost:3000/api/user', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test_token',
        },
      });

      const response = await getUser(req);
      const data = await response.json();

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/user', () => {
    it('should update user profile successfully', async () => {
      const mockPrisma = require('@/lib/prisma').prisma;
      mockPrisma.user.update.mockResolvedValueOnce({
        id: '1',
        email: 'test@example.com',
        name: 'Updated Name',
        bio: 'Updated bio',
      });

      const req = new Request('http://localhost:3000/api/user', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer test_token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Updated Name',
          bio: 'Updated bio',
        }),
      });

      const response = await updateUser(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user.name).toBe('Updated Name');
      expect(data.user.bio).toBe('Updated bio');
    });

    it('should prevent email updates through PUT /api/user', async () => {
      const req = new Request('http://localhost:3000/api/user', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer test_token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'newemail@example.com',
        }),
      });

      const response = await updateUser(req);
      const data = await response.json();

      expect(response.status).toBe(400);
    });

    it('should validate profile update data', async () => {
      const req = new Request('http://localhost:3000/api/user', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer test_token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '', // Invalid: empty name
          bio: 'x'.repeat(500), // Invalid: bio too long
        }),
      });

      const response = await updateUser(req);
      const data = await response.json();

      expect(response.status).toBe(400);
    });

    it('should reject requests without authorization', async () => {
      const req = new Request('http://localhost:3000/api/user', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated Name',
        }),
      });

      const response = await updateUser(req);
      const data = await response.json();

      expect(response.status).toBe(401);
    });
  });
});
