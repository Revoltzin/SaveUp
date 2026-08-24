import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import rateLimiterAuth from "../middlewares/rateLimiterAuth";

const authRoutes = Router();

authRoutes.post("/register", rateLimiterAuth, register);
authRoutes.post("/login", rateLimiterAuth, login);

export default authRoutes;
