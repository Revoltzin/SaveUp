import { Request, Response } from "express";
import { createCategorySchema, updateCategorySchema } from "../schemas/category.schema";
import {
    createCategory,
    listCategoriesByUser,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "../services/category.service";
import AppError from "../errors/AppError";

export async function create(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) throw new AppError(401, "Not authenticated");

    const { name, type, icon } = createCategorySchema.parse(req.body);

    const category = await createCategory({ userId, name, type, icon });

    res.status(201).json(category);
}

export async function list(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) throw new AppError(401, "Not authenticated");

    const categories = await listCategoriesByUser(userId);

    res.status(200).json(categories);
}

export async function getById(req: Request<{ id: string }>, res: Response) {
    const userId = req.user?.sub;
    if (!userId) throw new AppError(401, "Not authenticated");

    const { id } = req.params;

    const category = await getCategoryById(id, userId);

    res.status(200).json(category);
}

export async function update(req: Request<{ id: string }>, res: Response) {
    const userId = req.user?.sub;
    if (!userId) throw new AppError(401, "Not authenticated");

    const { id } = req.params;

    const data = updateCategorySchema.parse(req.body);

    const updatedCategory = await updateCategory(id, userId, data);

    res.status(200).json(updatedCategory);
}

export async function remove(req: Request<{ id: string }>, res: Response) {
    const userId = req.user?.sub;
    if (!userId) throw new AppError(401, "Not authenticated");

    const { id } = req.params;

    await deleteCategory(id, userId);

    res.status(204).send();
}
