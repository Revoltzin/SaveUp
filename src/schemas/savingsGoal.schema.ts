import { z } from "zod";

export const createSavingsGoalSchema = z.object({
    name: z.string().min(2),
    targetAmount: z.number(),
    deadline: z.coerce.date().optional(),
});

export const updateSavingsGoalSchema = z.object({
    name: z.string().min(2).optional(),
    targetAmount: z.number().optional(),
    deadline: z.coerce.date().optional(),
    status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
});
