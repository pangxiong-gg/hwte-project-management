import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'hwte-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface LoginResult {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    orgId: string;
    roles: string[];
  };
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      roles: { include: { role: true } }
    }
  });

  if (!user || !user.password) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id, orgId: user.orgId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      orgId: user.orgId,
      roles: user.roles.map(r => r.role.name)
    }
  };
}

export async function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string; orgId: string };
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: { include: { role: true } },
      organization: true,
      division: true,
      team: true
    }
  });
}