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

export async function listContributionsByGoal(goalId: string, userId: string) {
    await getSavingsGoalById(goalId, userId);

    return prisma.contribution.findMany({
        where: { goalId },
        orderBy: { createdAt: "desc" },
    });
}

export async function getGoalCurrentAmount(goalId: string, userId: string) {
    await getSavingsGoalById(goalId, userId);

    return prisma.contribution.aggregate({
        where: { goalId },
        _sum: { amount: true },
    });
}
