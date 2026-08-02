import { Request, Response, NextFunction } from "express";

// Interace seria como o contrato do objeto e as tipages/regras
// definidas somente para esse objeto
interface AppError extends Error {
    statusCode?: number;
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    console.log(err);
    const status =
        err instanceof Error && "statusCode" in err
            ? ((err as AppError).statusCode ?? 500) // Retorna 500 somente se o statusCode for nulo ou undefined
            : 500;
    const message = err instanceof Error ? err.message : "Internal Server error";
    res.status(status).json(message);
}
