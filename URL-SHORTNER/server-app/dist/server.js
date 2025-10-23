"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const shortUrl_1 = __importDefault(require("./routes/shortUrl"));
const linkGroup_1 = __importDefault(require("./routes/linkGroup"));
dotenv_1.default.config();
(0, dbConfig_1.default)();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.set("trust proxy", 1);
// Rate limiter
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
// Apply rate limiter globally
app.use(limiter);
// Mount API routes under /api
app.use("/api", shortUrl_1.default);
app.use("/api", linkGroup_1.default);
// Mount redirect routes at the root level
const shortUrl_2 = require("./controllers/shortUrl");
const linkGroup_2 = require("./routes/linkGroup");
// Handle group link pages (must come before /:id to avoid conflicts)
app.get("/g/:groupUrl", linkGroup_2.getLinkGroupPage);
// Handle short URLs
app.get("/:id", shortUrl_2.getUrl);
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
