import { z } from "zod";

export const createContributionSchema = z.object({
    amount: z.number().positive(),
});
