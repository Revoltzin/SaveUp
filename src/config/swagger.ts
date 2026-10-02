import swaggerJSDoc from "swagger-jsdoc";
import env from "./env";

const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SaveUp API",
            version: "1.0.0",
            description:
                "Backend da SaveUp — app de decisões financeiras e metas de economia gamificadas.",
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}`,
                description: "Servidor da API (porta diferente da UI do Swagger)",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string" },
                        email: { type: "string", format: "email" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                SavingsGoal: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        userId: { type: "string", format: "uuid" },
                        name: { type: "string" },
                        targetAmount: { type: "string", example: "5000" },
                        deadline: { type: "string", format: "date-time", nullable: true },
                        status: { type: "string", enum: ["ACTIVE", "COMPLETED", "ARCHIVED"] },
                        createdAt: { type: "string", format: "date-time" },
                        currentAmount: { type: "string", example: "350.5" },
                    },
                },
                Contribution: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        goalId: { type: "string", format: "uuid" },
                        amount: { type: "string", example: "100" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                    },
                },
                ValidationError: {
                    type: "object",
                    properties: {
                        message: { type: "string", example: "Validation error" },
                        errors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    path: { type: "string" },
                                    message: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./src/routes/*.routes.ts"],
});

export default swaggerSpec;