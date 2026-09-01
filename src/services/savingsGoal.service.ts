import prisma from "../lib/prisma";
import AppError from "../errors/AppError";
import { GoalStatus } from "../generated/prisma/client";

interface CreateSavingsGoalInput {
    userId: string;
    name: string;
    targetAmount: number;
    deadline?: Date | undefined;
}

interface UpdateSavingsGoalInput {
    name?: string | undefined;
    targetAmount?: number | undefined;
    deadline?: Date | null | undefined;
    status?: GoalStatus | undefined;
}

export async function createSavingsGoal({ userId, name, targetAmount, deadline }: CreateSavingsGoalInput) {
    return prisma.savingsGoal.create({
        data: { userId, name, targetAmount, deadline: deadline ?? null },
    });
}

export async function listSavingsGoalsByUser(userId: string) {
    return prisma.savingsGoal.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}

export async function getSavingsGoalById(id: string, userId: string) {
    const goal = await prisma.savingsGoal.findFirst({
        where: { id, userId },
    });

    if (!goal) throw new AppError(404, "Savings goal not found");

    return goal;
}

export async function updateSavingsGoal(id: string, userId: string, data: UpdateSavingsGoalInput) {
    await getSavingsGoalById(id, userId);

    return prisma.savingsGoal.update({
        where: { id },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.targetAmount !== undefined && { targetAmount: data.targetAmount }),
            ...(data.deadline !== undefined && { deadline: data.deadline }),
            ...(data.status !== undefined && { status: data.status }),
        },
    });
}

export async function deleteSavingsGoal(id: string, userId: string) {
    await getSavingsGoalById(id, userId);

    await prisma.savingsGoal.delete({ where: { id } });
}
