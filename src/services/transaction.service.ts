import prisma from "../lib/prisma";
import AppError from "../errors/AppError";
import { TransactionType } from "../generated/prisma/client";
import { getCategoryById } from "./category.service";

interface CreateTransactionInput {
    userId: string;
    categoryId: string;
    amount: number;
    type: TransactionType;
    description?: string | undefined;
    date: Date;
}

interface UpdateTransactionInput {
    categoryId?: string | undefined;
    amount?: number | undefined;
    type?: TransactionType | undefined;
    description?: string | null | undefined;
    date?: Date | undefined;
}

export async function createTransaction({
    userId,
    categoryId,
    amount,
    type,
    description,
    date,
}: CreateTransactionInput) {
    await getCategoryById(categoryId, userId);

    return prisma.transaction.create({
        data: { userId, categoryId, amount, type, description: description ?? null, date },
    });
}

export async function listTransactionsByUser(userId: string) {
    return prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
    });
}

export async function getTransactionById(id: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
        where: { id, userId },
    });

    if (!transaction) throw new AppError(404, "Transaction not found");

    return transaction;
}

export async function updateTransaction(id: string, userId: string, data: UpdateTransactionInput) {
    await getTransactionById(id, userId);

    if (data.categoryId !== undefined) {
        await getCategoryById(data.categoryId, userId);
    }

    return prisma.transaction.update({
        where: { id },
        data: {
            ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
            ...(data.amount !== undefined && { amount: data.amount }),
            ...(data.type !== undefined && { type: data.type }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.date !== undefined && { date: data.date }),
        },
    });
}

export async function deleteTransaction(id: string, userId: string) {
    await getTransactionById(id, userId);

    await prisma.transaction.delete({ where: { id } });
}
