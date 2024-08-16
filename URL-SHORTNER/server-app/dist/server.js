"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const shortUrl_1 = __importDefault(require("./routes/shortUrl"));
dotenv_1.default.config();
(0, dbConfig_1.default)();
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "https://localhost:3000",
    credentials: true,
}));
app.use("/api/", shortUrl_1.default);
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
