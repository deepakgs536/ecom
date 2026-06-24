import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().min(1),
  CART_SERVICE_URL: z.string().url().default('http://localhost:3000'),
});

const cleanEnv = Object.fromEntries(
  Object.entries(process.env).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
);

const _env = envSchema.safeParse(cleanEnv);

if (!_env.success) {
  console.error('Invalid environment variables', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
