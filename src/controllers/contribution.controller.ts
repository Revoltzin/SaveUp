import { Request, Response } from "express";
import { createContributionSchema } from "../schemas/contribution.schema";
import { createContribution, listContributionsByGoal } from "../services/contribution.service";
import AppError from "../errors/AppError";

export async function create(req: Request<{ id: string }>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) throw new AppError(401, "Not authenticated");

    const { id: goalId } = req.params;

    const { amount } = createContributionSchema.parse(req.body);

    const contribution = await createContribution({ userId, goalId, amount });

    res.status(201).json(contribution);
}

export async function list(req: Request<{ id: string }>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) throw new AppError(401, "Not authenticated");

    const { id: goalId } = req.params;

    const contributions = await listContributionsByGoal(goalId, userId);

    res.status(200).json(contributions);
}