import { Redis } from "ioredis"
import { env } from "./env"

export const redis = new Redis({
    host: env.REDIS_URL,
    port: 6379,
    password: env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
})


redis.on("error", (err) => console.log("Redis Client Error", err));
redis.on("connect", () => console.log("Redis connected"));

export async function connectRedis() {
    await redis.connect();
}
