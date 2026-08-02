import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../config/env";

export function signToken(payload: { sub: string }) {
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1h" });
    return token;
}

export function verifyToken(token: string): JwtPayload | string | undefined {
    return jwt.verify(token, env.JWT_SECRET);
}
