import { Router } from "express";
import { create, list } from "../controllers/contribution.controller";
import { authJwt } from "../middlewares/authMiddleware";

const contributionRoutes = Router({ mergeParams: true });

contributionRoutes.post("/", authJwt, create);
contributionRoutes.get("/", authJwt, list);

export default contributionRoutes;