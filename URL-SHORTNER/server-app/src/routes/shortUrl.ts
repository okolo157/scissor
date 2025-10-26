import express from "express";
import { createUrl, deleteUrl, getUrl } from "../controllers/shortUrl";

const router = express.Router();

router.post("/shortUrl", createUrl);
// Remove the conflicting route - we'll handle redirects directly in server.ts
// router.get("/:id", getUrl);
router.delete("/shortUrl/:id", deleteUrl);

export default router;
