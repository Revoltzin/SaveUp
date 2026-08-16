import prisma from "../lib/prisma";
import { getSavingsGoalById } from "./savingsGoal.service";

interface CreateContributionInput {
    userId: string;
    goalId: string;
    amount: number;
}

export async function createContribution({ userId, goalId, amount }: CreateContributionInput) {
    await getSavingsGoalById(goalId, userId);

    return prisma.contribution.create({
        data: { goalId, amount },
    });
}
