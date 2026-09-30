import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";

const credentials = {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "senha12345",
};

describe("POST /auth/register", () => {
    it("cria um usuário e nunca devolve a senha", async () => {
        const res = await request(app).post("/auth/register").send(credentials);

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            name: credentials.name,
            email: credentials.email,
        });
        expect(res.body).not.toHaveProperty("password");
    });

    it("rejeita email duplicado com 409", async () => {
        await request(app).post("/auth/register").send(credentials);

        const res = await request(app).post("/auth/register").send(credentials);

        expect(res.status).toBe(409);
    });

    it("rejeita input inválido com 400", async () => {
        const res = await request(app).post("/auth/register").send({
            name: "J",
            email: "not-an-email",
            password: "123",
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Validation error");
    });
});

describe("POST /auth/login", () => {
    it("retorna um token para credenciais válidas", async () => {
        await request(app).post("/auth/register").send(credentials);

        const res = await request(app).post("/auth/login").send({
            email: credentials.email,
            password: credentials.password,
        });

        expect(res.status).toBe(200);
        expect(typeof res.body.token).toBe("string");
    });

    it("rejeita senha errada com 401", async () => {
        await request(app).post("/auth/register").send(credentials);

        const res = await request(app).post("/auth/login").send({
            email: credentials.email,
            password: "senha-errada",
        });

        expect(res.status).toBe(401);
    });

    it("rejeita email inexistente com 401", async () => {
        const res = await request(app).post("/auth/login").send({
            email: "ninguem@example.com",
            password: "qualquer-coisa",
        });

        expect(res.status).toBe(401);
    });
});