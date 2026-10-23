import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { createUserAndLogin, createGoal } from "./helpers";

describe("Ciclo de vida completo de uma SavingsGoal", () => {
    it("cria, lista, busca, atualiza e deleta uma meta", async () => {
        const token = await createUserAndLogin("user@example.com");

        const createRes = await request(app)
            .post("/goals")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Viagem", targetAmount: 5000 });

        expect(createRes.status).toBe(201);
        expect(createRes.body.currentAmount).toBe("0");
        const goalId = createRes.body.id as string;

        const listRes = await request(app).get("/goals").set("Authorization", `Bearer ${token}`);
        expect(listRes.status).toBe(200);
        expect(listRes.body).toHaveLength(1);

        const getRes = await request(app)
            .get(`/goals/${goalId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(getRes.status).toBe(200);
        expect(getRes.body.name).toBe("Viagem");

        const updateRes = await request(app)
            .patch(`/goals/${goalId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ targetAmount: 7000, status: "COMPLETED" });
        expect(updateRes.status).toBe(200);
        expect(updateRes.body.targetAmount).toBe("7000");
        expect(updateRes.body.status).toBe("COMPLETED");

        const deleteRes = await request(app)
            .delete(`/goals/${goalId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(deleteRes.status).toBe(204);

        const getAfterDeleteRes = await request(app)
            .get(`/goals/${goalId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(getAfterDeleteRes.status).toBe(404);
    });
});

describe("Validação de SavingsGoal", () => {
    it("rejeita targetAmount zero ou negativo na criação", async () => {
        const token = await createUserAndLogin("user@example.com");

        const zeroRes = await request(app)
            .post("/goals")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Meta", targetAmount: 0 });
        expect(zeroRes.status).toBe(400);

        const negativeRes = await request(app)
            .post("/goals")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Meta", targetAmount: -100 });
        expect(negativeRes.status).toBe(400);
    });

    it("rejeita targetAmount negativo na atualização", async () => {
        const token = await createUserAndLogin("user@example.com");
        const goalId = await createGoal(token);

        const res = await request(app)
            .patch(`/goals/${goalId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ targetAmount: -1 });

        expect(res.status).toBe(400);
    });

    it("rejeita status inválido na atualização", async () => {
        const token = await createUserAndLogin("user@example.com");
        const goalId = await createGoal(token);

        const res = await request(app)
            .patch(`/goals/${goalId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ status: "NAO_EXISTE" });

        expect(res.status).toBe(400);
    });

    it("permite limpar o deadline enviando null, sem virar epoch", async () => {
        const token = await createUserAndLogin("user@example.com");
        const goalId = await createGoal(token, { deadline: "2027-01-01" });

        const res = await request(app)
            .patch(`/goals/${goalId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ deadline: null });

        expect(res.status).toBe(200);
        expect(res.body.deadline).toBeNull();
    });
});