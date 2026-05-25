import mongoose from "mongoose"
import { MongoClient } from "mongodb"
import { env } from "./env";

// Connect Mongoose
mongoose.connect(env.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB via Mongoose")
}).catch((err) => {
    console.error("Mongoose connection error:", err)
    process.exit(1)
})

// Native MongoDB client & database for Better-Auth
export const mongoClient = new MongoClient(env.MONGODB_URI);
export const mongoDb = mongoClient.db();

