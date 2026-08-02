import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import env from "./config/env";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use(errorHandler);

const PORT = env.PORT ?? 3000;
app.listen(PORT, () => console.log("Server Online"));
