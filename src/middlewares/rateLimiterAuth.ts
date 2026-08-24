import rateLimit from "express-rate-limit";

export default rateLimit({
    windowMs: 900000, // 15 min
    limit: 10,
});
