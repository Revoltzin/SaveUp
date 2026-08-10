import { hashPassword } from "../utils/hash";
import prisma from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import AppError from "../errors/AppError";

interface CreateUserInput {
    name: string;
    email: string;
    password: string;
}

export async function createUser({ name, email, password }: CreateUserInput) {
    const hashedPassword = await hashPassword(password);

    try {
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });
        return user;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new AppError(409, "Email already registered");
        }
        throw error;
    }
}

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
}
