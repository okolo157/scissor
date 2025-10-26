"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shortUrl_1 = require("../controllers/shortUrl");
const router = express_1.default.Router();
router.post("/shortUrl", shortUrl_1.createUrl);
// Remove the conflicting route - we'll handle redirects directly in server.ts
// router.get("/:id", getUrl);
router.delete("/shortUrl/:id", shortUrl_1.deleteUrl);
exports.default = router;
