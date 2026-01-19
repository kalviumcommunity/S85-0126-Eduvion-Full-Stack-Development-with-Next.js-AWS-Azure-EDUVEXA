// Temporary mock for Prisma Client while setup is in progress
// This allows the build to succeed
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
} 

export const prisma = {
  user: {
    findUnique: async (_args: any): Promise<User | null> => null,
    findMany: async (_args?: any): Promise<User[]> => [],
    create: async (args: any): Promise<User> => ({ ...args.data, id: 1, createdAt: new Date(), updatedAt: new Date() } as User),
    update: async (args: any): Promise<User> => args.data,
    delete: async (_args: any): Promise<User | null> => null,
  },
};