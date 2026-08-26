import { createSavingsGoalSchema } from "../schemas/savingsGoal.schema";
import {
    createSavingsGoal,
    listSavingsGoalsByUser,
    getSavingsGoalById,
} from "../services/savingsGoal.service";
import { Request, Response } from "express";
import AppError from "../errors/AppError";

export async function create(req: Request, res: Response) {
    const userId = req.user?.sub;

    if (!userId) throw new AppError(401, "Not authenticated");

    const { name, targetAmount, deadline } = createSavingsGoalSchema.parse(req.body);

    const goal = await createSavingsGoal({ userId, name, targetAmount, deadline });

    res.status(201).json(goal);
}

export async function list(req: Request, res: Response) {
    const userId = req.user?.sub;

    if (!userId) throw new AppError(401, "Not Authenticated");

    const listGoal = await listSavingsGoalsByUser(userId);

    res.status(200).json(listGoal);
}

export async function getById(req: Request<{ id: string }>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) throw new AppError(401, "Not authenticated");

    const { id } = req.params;

    const goal = await getSavingsGoalById(id, userId);

    res.status(200).json(goal);
}
