import { Router } from "express";
import { create, list, getById, update, remove } from "../controllers/savingsGoal.controller";
import { authJwt } from "../middlewares/authMiddleware";
import contributionRoutes from "./contribution.routes";

const savingsGoalRoutes = Router();

/**
 * @openapi
 * /goals:
 *   post:
 *     tags: [SavingsGoal]
 *     summary: Cria uma meta de economia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, targetAmount]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               targetAmount:
 *                 type: number
 *                 exclusiveMinimum: 0
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Meta criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavingsGoal'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Não autenticado
 */
savingsGoalRoutes.post("/", authJwt, create);

/**
 * @openapi
 * /goals:
 *   get:
 *     tags: [SavingsGoal]
 *     summary: Lista as metas do usuário autenticado
 *     responses:
 *       200:
 *         description: Lista de metas, cada uma com currentAmount calculado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SavingsGoal'
 *       401:
 *         description: Não autenticado
 */
savingsGoalRoutes.get("/", authJwt, list);

/**
 * @openapi
 * /goals/{id}:
 *   get:
 *     tags: [SavingsGoal]
 *     summary: Busca uma meta por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Meta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavingsGoal'
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Meta não encontrada ou não pertence ao usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
savingsGoalRoutes.get("/:id", authJwt, getById);

/**
 * @openapi
 * /goals/{id}:
 *   patch:
 *     tags: [SavingsGoal]
 *     summary: Atualiza parcialmente uma meta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               targetAmount:
 *                 type: number
 *                 exclusiveMinimum: 0
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: Envie null para limpar o prazo
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, COMPLETED, ARCHIVED]
 *     responses:
 *       200:
 *         description: Meta atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavingsGoal'
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
savingsGoalRoutes.patch("/:id", authJwt, update);

/**
 * @openapi
 * /goals/{id}:
 *   delete:
 *     tags: [SavingsGoal]
 *     summary: Remove uma meta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204:
 *         description: Meta removida
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Meta não encontrada ou não pertence ao usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
savingsGoalRoutes.delete("/:id", authJwt, remove);

savingsGoalRoutes.use("/:id/contributions", contributionRoutes);

export default savingsGoalRoutes;