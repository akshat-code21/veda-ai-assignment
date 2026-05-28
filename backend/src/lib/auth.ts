import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { mongoClient, mongoDb } from "../config/db";
import { env } from "../config/env";

const isProduction = process.env.NODE_ENV === "production" || !env.BETTER_AUTH_URL.includes("localhost");

export const auth = betterAuth({
    database: mongodbAdapter(mongoDb, {
        client: mongoClient,
    }),
    emailAndPassword: { enabled: true },
    trustedOrigins: [env.FRONTEND_URL],
    advanced: {
        crossSubDomainCookies: {
            enabled: false,
        },
        defaultCookieAttributes: {
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
        },
    },
});