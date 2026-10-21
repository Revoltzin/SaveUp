import { z } from "zod";

export const createTransactionSchema = z.object({
    categoryId: z.string(),
    amount: z.number().positive(),
    type: z.enum(["INCOME", "EXPENSE"]),
    description: z.string().optional(),
    date: z.coerce.date(),
});

export const updateTransactionSchema = z.object({
    categoryId: z.string().optional(),
    amount: z.number().positive().optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    description: z.union([z.null(), z.string()]).optional(),
    date: z.coerce.date().optional(),
});
