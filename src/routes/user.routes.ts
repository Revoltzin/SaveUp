import { Router } from "express";
import { me } from "../controllers/user.controller";
import { authJwt } from "../middlewares/authMiddleware";

const userRoutes = Router();

/**
 * @openapi
 * /me:
 *   get:
 *     tags: [User]
 *     summary: Retorna os dados do usuário autenticado
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRoutes.get("/me", authJwt, me);

export default userRoutes;