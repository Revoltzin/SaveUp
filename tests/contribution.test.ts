import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { createUserAndLogin, createGoal } from "./helpers";

describe("Criar e listar aportes", () => {
    it("cria aportes e lista todos os aportes da meta", async () => {
        const token = await createUserAndLogin("user@example.com");
        const goalId = await createGoal(token);

        const createRes = await request(app)
            .post(`/goals/${goalId}/contributions`)
            .set("Authorization", `Bearer ${token}`)
            .send({ amount: 100 });
        expect(createRes.status).toBe(201);

        await request(app)
            .post(`/goals/${goalId}/contributions`)
            .set("Authorization", `Bearer ${token}`)
            .send({ amount: 250.5 });

        const listRes = await request(app)
            .get(`/goals/${goalId}/contributions`)
            .set("Authorization", `Bearer ${token}`);

        expect(listRes.status).toBe(200);
        expect(listRes.body).toHaveLength(2);
    });

    it("rejeita aporte com valor zero ou negativo", async () => {
        const token = await createUserAndLogin("user@example.com");
        const goalId = await createGoal(token);

        const zeroRes = await request(app)
            .post(`/goals/${goalId}/contributions`)
            .set("Authorization", `Bearer ${token}`)
            .send({ amount: 0 });
        expect(zeroRes.status).toBe(400);

        const negativeRes = await request(app)
            .post(`/goals/${goalId}/contributions`)
            .set("Authorization", `Bearer ${token}`)
            .send({ amount: -50 });
        expect(negativeRes.status).toBe(400);
    });

    it("retorna 404 ao criar aporte numa meta inexistente", async () => {
        const token = await createUserAndLogin("user@example.com");
        const fakeGoalId = "00000000-0000-0000-0000-000000000000";

        const res = await request(app)
            .post(`/goals/${fakeGoalId}/contributions`)
            .set("Authorization", `Bearer ${token}`)
            .send({ amount: 100 });

        expect(res.status).toBe(404);
    });
});

describe("currentAmount reflete a soma dos aportes", () => {
    it("começa em 0 e cresce a cada aporte", async () => {
        const token = await createUserAndLogin("user@example.com");
        const goalId = await createGoal(token);

        const beforeRes = await request(app)
            .get(`/goals/${goalId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(beforeRes.body.currentAmount).toBe("0");

        await request(app)
            .post(`/goals/${goalId}/contributions`)
            .set("Authorization", `Bearer ${token}`)
            .send({ amount: 100 });

        await request(app)
            .post(`/goals/${goalId}/contributions`)
            .set("Authorization", `Bearer ${token}`)
            .send({ amount: 250.5 });

        const afterRes = await request(app)
            .get(`/goals/${goalId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(afterRes.body.currentAmount).toBe("350.5");
    });

    it("também aparece corretamente na listagem de goals", async () => {
        const token = await createUserAndLogin("user@example.com");
        const goalId = await createGoal(token);

        await request(app)
            .post(`/goals/${goalId}/contributions`)
            .set("Authorization", `Bearer ${token}`)
            .send({ amount: 42 });

        const listRes = await request(app).get("/goals").set("Authorization", `Bearer ${token}`);

        expect(listRes.body[0].currentAmount).toBe("42");
    });
});