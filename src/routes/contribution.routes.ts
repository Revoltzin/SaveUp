import { Router } from "express";
import { create, list } from "../controllers/contribution.controller";
import { authJwt } from "../middlewares/authMiddleware";

const contributionRoutes = Router({ mergeParams: true });

/**
 * @openapi
 * /goals/{id}/contributions:
 *   post:
 *     tags: [Contribution]
 *     summary: Registra um aporte numa meta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: Id da meta (SavingsGoal)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 exclusiveMinimum: 0
 *     responses:
 *       201:
 *         description: Aporte criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contribution'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Meta não encontrada ou não pertence ao usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
contributionRoutes.post("/", authJwt, create);

/**
 * @openapi
 * /goals/{id}/contributions:
 *   get:
 *     tags: [Contribution]
 *     summary: Lista os aportes de uma meta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: Id da meta (SavingsGoal)
 *     responses:
 *       200:
 *         description: Lista de aportes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contribution'
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Meta não encontrada ou não pertence ao usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
contributionRoutes.get("/", authJwt, list);

export default contributionRoutes;