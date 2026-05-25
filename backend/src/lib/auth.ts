import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { mongoClient, mongoDb } from "../config/db";
import { env } from "../config/env";

export const auth = betterAuth({
    database: mongodbAdapter(mongoDb, {
        client: mongoClient,
    }),
    emailAndPassword: { enabled: true },
    trustedOrigins: [env.FRONTEND_URL],
});