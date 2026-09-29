import { config } from "dotenv";

config({ path: ".env.test", override: true });

import { beforeEach, afterAll } from "vitest";
import prisma from "../src/lib/prisma";

beforeEach(async () => {
    await prisma.contribution.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.savingsGoal.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});