import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import savingsGoalRoutes from "./savingsGoal.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use(userRoutes);
routes.use("/goals", savingsGoalRoutes);

export default routes;
