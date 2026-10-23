import { Router } from "express";
import { create, list, getById, update, remove } from "../controllers/category.controller";
import { authJwt } from "../middlewares/authMiddleware";

const categoryRoutes = Router();

/**
 * @openapi
 * /categories:
 *   post:
 *     tags: [Category]
 *     summary: Cria uma categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoria criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Não autenticado
 */
categoryRoutes.post("/", authJwt, create);

/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Category]
 *     summary: Lista as categorias do usuário autenticado
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: Não autenticado
 */
categoryRoutes.get("/", authJwt, list);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     tags: [Category]
 *     summary: Busca uma categoria por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Categoria não encontrada ou não pertence ao usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
categoryRoutes.get("/:id", authJwt, getById);

/**
 * @openapi
 * /categories/{id}:
 *   patch:
 *     tags: [Category]
 *     summary: Atualiza parcialmente uma categoria
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
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               icon:
 *                 type: string
 *                 nullable: true
 *                 description: Envie null para remover o ícone
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Categoria não encontrada ou não pertence ao usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
categoryRoutes.patch("/:id", authJwt, update);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     tags: [Category]
 *     summary: Remove uma categoria
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204:
 *         description: Categoria removida
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Categoria não encontrada ou não pertence ao usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Categoria ainda possui transações ou orçamentos vinculados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
categoryRoutes.delete("/:id", authJwt, remove);

export default categoryRoutes;
