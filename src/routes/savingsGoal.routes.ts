import { Router } from "express";
import { create, list, getById, update, remove } from "../controllers/savingsGoal.controller";
import { authJwt } from "../middlewares/authMiddleware";

const savingsGoalRoutes = Router();

savingsGoalRoutes.post("/", authJwt, create);
savingsGoalRoutes.get("/", authJwt, list);
savingsGoalRoutes.get("/:id", authJwt, getById);
savingsGoalRoutes.patch("/:id", authJwt, update);
savingsGoalRoutes.delete("/:id", authJwt, remove);

export default savingsGoalRoutes;