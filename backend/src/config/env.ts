import { z } from 'zod'
import "dotenv/config"

const envSchema = z.object({
    MONGODB_URI: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    FRONTEND_URL: z.string(),
    REDIS_URL: z.string(),
    REDIS_PASSWORD: z.string().optional(),
    OPENROUTER_API_KEY: z.string(),
    UPLOAD_DIR: z.string().default("uploads"),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_REGION: z.string(),
    S3_BUCKET_NAME: z.string(),
    CLOUDFRONT_DOMAIN: z.string(),
    OPENAI_API_KEY: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string()
})

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    process.exit(1);
}

export const env = _env.data;