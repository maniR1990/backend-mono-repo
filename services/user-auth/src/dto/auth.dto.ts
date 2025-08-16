import { z } from 'zod';

export const email = z.email().trim().toLowerCase();
export const password = z.string().min(8);

export const ProfileIn = z.object({
  fullName: z.string().min(1).max(100),
  bio: z.string().max(1000).optional().nullable(),
  preferredLanguage: z.string().min(2).max(16).optional().nullable(),
  profilePictureUrl: z.string().optional().nullable(),
});

export const SignupBody = z.object({
  email: email,
  password: password, // server will hash
  profile: ProfileIn.optional(), // <-- optional
});

export const userPublic = z.object({
  id: z.uuid(),
  email: email,
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  profile: z
    .object({
      userId: z.uuid(),
      fullName: z.string(),
      bio: z.string().nullable().optional(),
      preferredLanguage: z.string().nullable().optional(),
      updatedAt: z.date(),
    })
    .nullable()
    .optional(),
});

export const login = z.object({
  email: email,
  password: password,
});

export type SignupBodyV1 = z.infer<typeof SignupBody>;
export type login = z.infer<typeof login>;
