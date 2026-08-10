import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { createUser, findUserByEmail } from "../services/user.service";
import { comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";
import AppError from "../errors/AppError";

export async function register(req: Request, res: Response) {
    const { name, email, password } = registerSchema.parse(req.body);

    const user = await createUser({ name, email, password });
    const { password: _password, ...safeUser } = user;

    res.status(201).json(safeUser);
}

export async function login(req: Request, res: Response) {
    const { email, password } = loginSchema.parse(req.body);

    const user = await findUserByEmail(email);
    if (!user) throw new AppError(401, "Invalid credentials");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new AppError(401, "Invalid credentials");

    const token = signToken({ sub: user.id });

    res.json({ token });
}
