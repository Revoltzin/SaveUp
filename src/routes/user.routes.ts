import { Router } from "express";
import { me } from "../controllers/user.controller";
import { authJwt } from "../middlewares/authMiddleware";

const userRoutes = Router();

userRoutes.get("/me", authJwt, me);

export default userRoutes;
