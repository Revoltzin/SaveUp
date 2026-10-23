import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(2),
    type: z.enum(["INCOME", "EXPENSE"]),
    icon: z.string().optional(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(2).optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    icon: z.union([z.null(), z.string()]).optional(),
});
