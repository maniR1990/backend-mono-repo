import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default(4000),
  REDIS_URL: z.url(),
  DATABASE_URL: z.url(),
});

export const env = envSchema.parse(process.env);
