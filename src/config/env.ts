import "dotenv/config";

interface Env {
    JWT_SECRET: string;
    DATABASE_URL: string;
    PORT: number;
    NODE_ENV: string;
}

function getEnvVar(key: string): string {
    const value = process.env[key];

    if (!value) {
        console.error(`[env] Environment variable required missing: ${key}`);
        process.exit(1);
    }

    return value;
}

const env: Env = {
    JWT_SECRET: getEnvVar("JWT_SECRET"),
    DATABASE_URL: getEnvVar("DATABASE_URL"),
    PORT: Number(process.env.PORT) || 3000,
    NODE_ENV: process.env.NODE_ENV ?? "development",
};

export default env;
