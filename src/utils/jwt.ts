import jwt from "jsonwebtoken";
import env from "../config/env";

export interface TokenPayload {
    sub: string;
}

export function signToken(payload: TokenPayload) {
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1h" });
    return token;
}

export function verifyToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (typeof decoded === "string" || !decoded.sub) {
        throw new Error("Invalid token payload");
    }

    return { sub: decoded.sub };
}
