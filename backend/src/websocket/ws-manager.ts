import { WebSocketServer } from "ws";
import { WebSocket } from "ws";
import http from "http"
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

const conns = new Map<string, Set<WebSocket>>();

export function createWsServer(server: http.Server) {
    const wss = new WebSocketServer({ server });
    wss.on("connection", async (ws, req) => {
        const url = new URL(req.url!, `http://${req.headers.host}`);
        const token = url.searchParams.get("token");

        if (!token) {
            ws.close(1011, "Invalid token");
            return;
        }

        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) { ws.close(1008, "Unauthorized"); return; }

        const userId = session.user.id;
        if (!conns.has(userId)) conns.set(userId, new Set());
        conns.get(userId)!.add(ws);

        ws.on("ping", () => ws.pong());

        ws.on("close", () => {
            conns.get(userId)?.delete(ws);
        })
    });
}

export function broadcastToUser(userId: string, message: object) {
    const sockets = conns.get(userId);
    if (!sockets) return;
    const json = JSON.stringify(message);
    for (const ws of sockets) {
        if (ws.readyState === WebSocket.OPEN) ws.send(json);
    }
}