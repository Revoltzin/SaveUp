import request from "supertest";
import app from "../src/app";

export async function createUserAndLogin(email: string) {
    await request(app).post("/auth/register").send({
        name: "Test User",
        email,
        password: "senha12345",
    });

    const loginRes = await request(app).post("/auth/login").send({
        email,
        password: "senha12345",
    });

    return loginRes.body.token as string;
}

export async function createGoal(token: string, overrides: Record<string, unknown> = {}) {
    const res = await request(app)
        .post("/goals")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Meta", targetAmount: 1000, ...overrides });

    return res.body.id as string;
}