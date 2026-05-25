import express from "express"
import cors from "cors"
import { env } from "./config/env";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));

app.all("/api/auth/*splat", toNodeHandler(auth));


app.use(express.json());


app.listen(3000, () => {
    console.log(`Server up on port 3000`);
});