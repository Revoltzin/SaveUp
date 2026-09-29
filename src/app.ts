import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import routes from "./routes/routes";
import rateLimiterGlobal from "./middlewares/rateLimiterGlobal";

const app = express();

app.use(express.json());
app.use(rateLimiterGlobal);

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use(routes);
app.use(errorHandler);

export default app;