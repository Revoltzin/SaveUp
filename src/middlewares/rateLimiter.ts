import { rateLimit } from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 300, // general API usage across all routes, per IP
    standardHeaders: "draft-8",
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // tight limit to slow down brute-force/credential stuffing on register+login
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Too many attempts, please try again later." },
});
