import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import env from "./config/env";
import routes from "./routes/routes";
import rateLimiterGlobal from "./middlewares/rateLimiterGlobal";

const app = express();

app.use(globalLimiter);
app.use(express.json());
app.use(rateLimiterGlobal);

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use(routes);
app.use(errorHandler);

const PORT = env.PORT ?? 3000;
app.listen(PORT, () => console.log("Server Online"));
