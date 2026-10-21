import { Request, Response } from "express";
import { createTransactionSchema, updateTransactionSchema } from "../schemas/transaction.schema";
import {
    createTransaction,
    listTransactionsByUser,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
} from "../services/transaction.service";
import AppError from "../errors/AppError";

export async function create(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) throw new AppError(401, "Not authenticated");

    const { categoryId, amount, type, description, date } = createTransactionSchema.parse(req.body);

    const transaction = await createTransaction({ userId, categoryId, amount, type, description, date });

    res.status(201).json(transaction);
}

export async function list(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) throw new AppError(401, "Not authenticated");

    const transactions = await listTransactionsByUser(userId);

    res.status(200).json(transactions);
}

export async function getById(req: Request<{ id: string }>, res: Response) {
    const userId = req.user?.sub;
    if (!userId) throw new AppError(401, "Not authenticated");

    const { id } = req.params;

    const transaction = await getTransactionById(id, userId);

    res.status(200).json(transaction);
}

export async function update(req: Request<{ id: string }>, res: Response) {
    const userId = req.user?.sub;
    if (!userId) throw new AppError(401, "Not authenticated");

    const { id } = req.params;

    const data = updateTransactionSchema.parse(req.body);

    const updatedTransaction = await updateTransaction(id, userId, data);

    res.status(200).json(updatedTransaction);
}

export async function remove(req: Request<{ id: string }>, res: Response) {
    const userId = req.user?.sub;
    if (!userId) throw new AppError(401, "Not authenticated");

    const { id } = req.params;

    await deleteTransaction(id, userId);

    res.status(204).send();
}
