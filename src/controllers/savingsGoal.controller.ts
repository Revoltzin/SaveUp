import { createSavingsGoalSchema, updateSavingsGoalSchema } from "../schemas/savingsGoal.schema";
import {
    createSavingsGoal,
    listSavingsGoalsByUser,
    getSavingsGoalById,
    updateSavingsGoal,
    deleteSavingsGoal,
} from "../services/savingsGoal.service";
import { getGoalCurrentAmount } from "../services/contribution.service";
import { SavingsGoal } from "../generated/prisma/client";
import { Request, Response } from "express";
import AppError from "../errors/AppError";

async function withCurrentAmount(goal: SavingsGoal, userId: string) {
    const { _sum } = await getGoalCurrentAmount(goal.id, userId);

    return { ...goal, currentAmount: _sum.amount?.toString() ?? "0" };
}

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

    const goals = await listSavingsGoalsByUser(userId);

    const goalsWithAmount = await Promise.all(goals.map((goal) => withCurrentAmount(goal, userId)));

    res.status(200).json(goalsWithAmount);
}

export async function getById(req: Request<{ id: string }>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) throw new AppError(401, "Not authenticated");

    const { id } = req.params;

    const goal = await getSavingsGoalById(id, userId);

    res.status(200).json(await withCurrentAmount(goal, userId));
}

export async function update(req: Request<{ id: string }>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) throw new AppError(401, "Not Authenticated");

    const { id } = req.params;

    const data = updateSavingsGoalSchema.parse(req.body);

    const updatedGoal = await updateSavingsGoal(id, userId, data);

    res.status(200).json(updatedGoal);
}

export async function remove(req: Request<{ id: string }>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) throw new AppError(401, "Not Authenticated");

    const { id } = req.params;

    await deleteSavingsGoal(id, userId);

    res.status(204).send();
}
