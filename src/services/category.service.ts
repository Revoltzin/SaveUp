import prisma from "../lib/prisma";
import AppError from "../errors/AppError";
import { Prisma, TransactionType } from "../generated/prisma/client";

interface CreateCategoryInput {
    userId: string;
    name: string;
    type: TransactionType;
    icon?: string | undefined;
}

interface UpdateCategoryInput {
    name?: string | undefined;
    type?: TransactionType | undefined;
    icon?: string | null | undefined;
}

export async function createCategory({ userId, name, type, icon }: CreateCategoryInput) {
    return prisma.category.create({
        data: { userId, name, type, icon: icon ?? null },
    });
}

export async function listCategoriesByUser(userId: string) {
    return prisma.category.findMany({
        where: { userId },
        orderBy: { name: "asc" },
    });
}

export async function getCategoryById(id: string, userId: string) {
    const category = await prisma.category.findFirst({
        where: { id, userId },
    });

    if (!category) throw new AppError(404, "Category not found");

    return category;
}

export async function updateCategory(id: string, userId: string, data: UpdateCategoryInput) {
    await getCategoryById(id, userId);

    return prisma.category.update({
        where: { id },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.type !== undefined && { type: data.type }),
            ...(data.icon !== undefined && { icon: data.icon }),
        },
    });
}

export async function deleteCategory(id: string, userId: string) {
    await getCategoryById(id, userId);

    try {
        await prisma.category.delete({ where: { id } });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
            throw new AppError(409, "Category still has transactions or budgets linked to it");
        }
        throw error;
    }
}
