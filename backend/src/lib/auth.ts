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
            enabled: isProduction,
            domain: isProduction ? ".akshat21.me" : undefined,
        },
        defaultCookieAttributes: {
            sameSite: isProduction ? "lax" : "lax",
            secure: isProduction,
        },
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID as string,
            clientSecret: env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});