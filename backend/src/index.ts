import express from "express"
import cors from "cors"
import { env } from "./config/env";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import assignmentRouter from "./routes/assignment";
import { createWsServer } from "./websocket/ws-manager";
import http from "http";
import "./workers/generation.worker";

const app = express();

app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));

app.all("/api/auth/*splat", toNodeHandler(auth));


app.use(express.json());
app.use("/api/assignments", assignmentRouter);
app.get("/health", (_, res) => {
    res.status(200).send("OK");
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(`[Error Handler] Error occurred:`, err.message);
    res.status(err.status || 400).json({ error: err.message || "An unexpected error occurred" });
});

const server = http.createServer(app);
createWsServer(server);



server.listen(3000, () => {
    console.log(`Server up on port 3000`);
});

export default server;