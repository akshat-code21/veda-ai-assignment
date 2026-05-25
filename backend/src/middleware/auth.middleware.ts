import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import type { NextFunction, Request, Response } from "express";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
        res.status(401).json({
            message: "Unauthenticated",
        });
        return;
    }

    res.locals.session = session;
    next();
};