import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { createUserAndLogin, createCategory } from "./helpers";

describe("Ciclo de vida completo de uma Category", () => {
    it("cria, lista, busca, atualiza e deleta uma categoria", async () => {
        const token = await createUserAndLogin("user@example.com");

        const createRes = await request(app)
            .post("/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Mercado", type: "EXPENSE", icon: "cart" });

        expect(createRes.status).toBe(201);
        const categoryId = createRes.body.id as string;

        const listRes = await request(app).get("/categories").set("Authorization", `Bearer ${token}`);
        expect(listRes.status).toBe(200);
        expect(listRes.body).toHaveLength(1);

        const getRes = await request(app)
            .get(`/categories/${categoryId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(getRes.status).toBe(200);
        expect(getRes.body.name).toBe("Mercado");

        const updateRes = await request(app)
            .patch(`/categories/${categoryId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ icon: null });
        expect(updateRes.status).toBe(200);
        expect(updateRes.body.icon).toBeNull();

        const deleteRes = await request(app)
            .delete(`/categories/${categoryId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(deleteRes.status).toBe(204);

        const getAfterDeleteRes = await request(app)
            .get(`/categories/${categoryId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(getAfterDeleteRes.status).toBe(404);
    });
});

describe("Validação de Category", () => {
    it("rejeita type inválido", async () => {
        const token = await createUserAndLogin("user@example.com");

        const res = await request(app)
            .post("/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Teste", type: "XYZ" });

        expect(res.status).toBe(400);
    });

    it("rejeita name curto", async () => {
        const token = await createUserAndLogin("user@example.com");

        const res = await request(app)
            .post("/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "A", type: "EXPENSE" });

        expect(res.status).toBe(400);
    });
});

describe("Proteção contra IDOR entre usuários (Category)", () => {
    it("usuário não consegue ver categoria de outro usuário (404)", async () => {
        const tokenA = await createUserAndLogin("userA@example.com");
        const tokenB = await createUserAndLogin("userB@example.com");
        const categoryId = await createCategory(tokenA);

        const res = await request(app)
            .get(`/categories/${categoryId}`)
            .set("Authorization", `Bearer ${tokenB}`);

        expect(res.status).toBe(404);
    });

    it("usuário não consegue deletar categoria de outro usuário (404)", async () => {
        const tokenA = await createUserAndLogin("userA@example.com");
        const tokenB = await createUserAndLogin("userB@example.com");
        const categoryId = await createCategory(tokenA);

        const res = await request(app)
            .delete(`/categories/${categoryId}`)
            .set("Authorization", `Bearer ${tokenB}`);

        expect(res.status).toBe(404);
    });
});
