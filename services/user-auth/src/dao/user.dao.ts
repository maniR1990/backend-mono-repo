// services/user-auth/src/repositories/user.repository.ts
import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../infra/db/prisma';
import bcrypt from 'bcryptjs';
import { SignupBodyV1 } from '../dto/auth.dto';
export type DbClient = PrismaClient | Prisma.TransactionClient;

// -------- helpers --------
function mapPrismaError(e: unknown): never {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002' && (e.meta as any)?.target?.includes?.('email')) {
      const err: any = new Error('EMAIL_TAKEN');
      err.code = 'EMAIL_TAKEN';
      throw err;
    }
  }
  throw e;
}

// -------- reads --------
export async function getUserById(userId: string, db: DbClient = prisma) {
  return db.user.findUnique({ where: { id: userId }, include: { profile: true } });
}

export async function getUserByEmail(email: string, db: DbClient = prisma) {
  return db.user.findUnique({ where: { email }, include: { profile: true } });
}

export async function verifyUserCredentials(email: string, db: DbClient = prisma) {
  return db.user.findUnique({
    where: { email },
  });
}

export async function listUsers(
  params: { limit?: number; cursor?: string | null } = {},
  db: DbClient = prisma,
) {
  const { limit = 20, cursor = null } = params;
  return db.user.findMany({
    take: limit,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { id: 'asc' },
    include: { profile: true },
  });
}

// -------- writes (no transactions) --------

export async function createUserWithProfile(input: SignupBodyV1, db: DbClient = prisma) {
  const hashed = await bcrypt.hash(input.password, 10);
  try {
    const user = await db.user.create({
      data: { email: input.email, passwordHash: hashed },
    });

    if (input.profile) {
      // note: without a transaction, if this fails the user row remains
      await db.userProfile.create({
        data: {
          userId: user.id,
          fullName: input.profile.fullName ?? null,
          bio: input.profile.bio ?? null,
          profilePictureUrl: input.profile.profilePictureUrl ?? null,
          preferredLanguage: input.profile.preferredLanguage ?? null,
          updatedAt: new Date(),
        },
      });
    }

    return db.user.findUnique({ where: { id: user.id }, include: { profile: true } });
  } catch (e) {
    mapPrismaError(e);
  }
}

export async function updateEmail(
  input: { userId: string; newEmail: string },
  db: DbClient = prisma,
) {
  try {
    return await db.user.update({
      where: { id: input.userId },
      data: { email: input.newEmail },
    });
  } catch (e) {
    mapPrismaError(e);
  }
}

export async function updatePassword(
  input: { userId: string; newPasswordHash: string },
  db: DbClient = prisma,
) {
  return db.user.update({
    where: { id: input.userId },
    data: { passwordHash: input.newPasswordHash },
  });
}

export async function upsertProfile(
  input: {
    userId: string;
    fullName?: string | null;
    bio?: string | null;
    profilePictureUrl?: string | null;
    preferredLanguage?: string | null;
  },
  db: DbClient = prisma,
) {
  return db.userProfile.upsert({
    where: { userId: input.userId },
    update: {
      fullName: input.fullName ?? null,
      bio: input.bio ?? null,
      profilePictureUrl: input.profilePictureUrl ?? null,
      preferredLanguage: input.preferredLanguage ?? null,
      updatedAt: new Date(),
    },
    create: {
      userId: input.userId,
      fullName: input.fullName ?? null,
      bio: input.bio ?? null,
      profilePictureUrl: input.profilePictureUrl ?? null,
      preferredLanguage: input.preferredLanguage ?? null,
      updatedAt: new Date(),
    },
  });
}

export async function setActive(userId: string, isActive: boolean, db: DbClient = prisma) {
  return db.user.update({ where: { id: userId }, data: { isActive } });
}

export async function deleteUser(userId: string, db: DbClient = prisma) {
  await db.user.delete({ where: { id: userId } });
  return true;
}
