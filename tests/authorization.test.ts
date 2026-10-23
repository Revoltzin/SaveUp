import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { createUserAndLogin, createGoal } from "./helpers";

describe("Autenticação exigida em rotas protegidas", () => {
    it("rejeita requisição sem token com 401", async () => {
        const res = await request(app).get("/goals");

        expect(res.status).toBe(401);
    });

    it("rejeita token inválido com 401", async () => {
        const res = await request(app).get("/goals").set("Authorization", "Bearer token-invalido");

        expect(res.status).toBe(401);
    });
});

describe("Proteção contra IDOR entre usuários (SavingsGoal)", () => {
    it("dono consegue acessar a própria meta normalmente", async () => {
        const tokenA = await createUserAndLogin("userA@example.com");
        const goalId = await createGoal(tokenA);

        const res = await request(app)
            .get(`/goals/${goalId}`)
            .set("Authorization", `Bearer ${tokenA}`);

        expect(res.status).toBe(200);
    });

    it("usuário não consegue ver meta de outro usuário (404)", async () => {
        const tokenA = await createUserAndLogin("userA@example.com");
        const tokenB = await createUserAndLogin("userB@example.com");
        const goalId = await createGoal(tokenA);

        const res = await request(app)
            .get(`/goals/${goalId}`)
            .set("Authorization", `Bearer ${tokenB}`);

        expect(res.status).toBe(404);
    });

    it("usuário não consegue atualizar meta de outro usuário (404)", async () => {
        const tokenA = await createUserAndLogin("userA@example.com");
        const tokenB = await createUserAndLogin("userB@example.com");
        const goalId = await createGoal(tokenA);

        const res = await request(app)
            .patch(`/goals/${goalId}`)
            .set("Authorization", `Bearer ${tokenB}`)
            .send({ targetAmount: 500 });

        expect(res.status).toBe(404);
    });

    it("usuário não consegue deletar meta de outro usuário, e ela continua existindo pro dono", async () => {
        const tokenA = await createUserAndLogin("userA@example.com");
        const tokenB = await createUserAndLogin("userB@example.com");
        const goalId = await createGoal(tokenA);

        const deleteRes = await request(app)
            .delete(`/goals/${goalId}`)
            .set("Authorization", `Bearer ${tokenB}`);

        expect(deleteRes.status).toBe(404);

        const stillThereRes = await request(app)
            .get(`/goals/${goalId}`)
            .set("Authorization", `Bearer ${tokenA}`);

        expect(stillThereRes.status).toBe(200);
    });

    it("cada usuário só vê as próprias metas em /goals", async () => {
        const tokenA = await createUserAndLogin("userA@example.com");
        const tokenB = await createUserAndLogin("userB@example.com");

        await createGoal(tokenA);
        await createGoal(tokenA);
        await createGoal(tokenB);

        const resA = await request(app).get("/goals").set("Authorization", `Bearer ${tokenA}`);
        const resB = await request(app).get("/goals").set("Authorization", `Bearer ${tokenB}`);

        expect(resA.body).toHaveLength(2);
        expect(resB.body).toHaveLength(1);
    });
});

describe("Proteção contra IDOR entre usuários (Contribution)", () => {
    it("usuário não consegue criar aporte na meta de outro usuário (404)", async () => {
        const tokenA = await createUserAndLogin("userA@example.com");
        const tokenB = await createUserAndLogin("userB@example.com");
        const goalId = await createGoal(tokenA);

        const res = await request(app)
            .post(`/goals/${goalId}/contributions`)
            .set("Authorization", `Bearer ${tokenB}`)
            .send({ amount: 100 });

        expect(res.status).toBe(404);
    });

    it("usuário não consegue listar aportes da meta de outro usuário (404)", async () => {
        const tokenA = await createUserAndLogin("userA@example.com");
        const tokenB = await createUserAndLogin("userB@example.com");
        const goalId = await createGoal(tokenA);

        await request(app)
            .post(`/goals/${goalId}/contributions`)
            .set("Authorization", `Bearer ${tokenA}`)
            .send({ amount: 100 });

        const res = await request(app)
            .get(`/goals/${goalId}/contributions`)
            .set("Authorization", `Bearer ${tokenB}`);

        expect(res.status).toBe(404);
    });
});