import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import routes from "./routes/routes";
import rateLimiterGlobal from "./middlewares/rateLimiterGlobal";
import env from "./config/env";

const app = express();

app.use(express.json());
app.use(rateLimiterGlobal);
app.use(cors({ origin: `http://localhost:${env.DOCS_PORT}` }));

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use(routes);
app.use(errorHandler);

export default app;
