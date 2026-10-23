import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import savingsGoalRoutes from "./savingsGoal.routes";
import categoryRoutes from "./category.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use(userRoutes);
routes.use("/goals", savingsGoalRoutes);
routes.use("/categories", categoryRoutes);

export default routes;
