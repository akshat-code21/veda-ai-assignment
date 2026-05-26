import IORedis from "ioredis"
import { env } from "./env"

export const redis = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
})


redis.on("error", (err) => console.log("Redis Client Error", err));
redis.on("connect", () => console.log("Redis connected"));

export async function connectRedis() {
    await redis.connect();
}
