import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authJwt(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token not initialized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Wrong token format" });
    }

    try {
        //const data = verifyToken(token);
        // Quando eu realmente for precisar da variavel data eu tiro os comentarios
        verifyToken(token);
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid token or expired" });
    }
}
