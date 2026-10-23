import rateLimit from "express-rate-limit";
import env from "../config/env";

export default rateLimit({
    windowMs: 900000, // 15 min
    limit: 10,
    skip: () => env.NODE_ENV === "test",
});
