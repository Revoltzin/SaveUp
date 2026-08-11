import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authLimiter } from "../middlewares/rateLimiter";

const authRoutes = Router();

authRoutes.use(authLimiter);
authRoutes.post("/register", register);
authRoutes.post("/login", login);

export default authRoutes;
