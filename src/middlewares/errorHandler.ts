import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    console.log(err);
    const status = err.statusCode ?? 500;
    res.status(status).json({
        message: err.message ?? "Internal Server Error!",
    });
}
