import { Request, Response } from "express";
import { findUserById } from "../services/user.service";
import AppError from "../errors/AppError";

export async function me(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) throw new AppError(401, "Not authenticated");

    const user = await findUserById(userId);
    if (!user) throw new AppError(404, "User not found");

    const { password: _password, ...safeUser } = user;
    res.json(safeUser);
}
