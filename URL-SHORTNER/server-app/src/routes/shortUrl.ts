import express from "express";
import {
  createUrl,
  deleteUrl,
  getUrl,
} from "../controllers/shortUrl";

const router = express.Router();

router.post("/shortUrl", createUrl);
router.get("/:id", getUrl);
router.delete("/shortUrl/:id", deleteUrl);

export default router;
