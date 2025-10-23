import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDb from "./config/dbConfig";
import shortUrl from "./routes/shortUrl";
import linkGroup from "./routes/linkGroup";

dotenv.config();
connectDb();

const port = process.env.PORT || 5000;
const app = express();

app.set("trust proxy", 1);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Apply rate limiter globally
app.use(limiter);

// Health check endpoint for keep-alive service (must be before wildcard routes)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend is alive",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount API routes under /api
app.use("/api", shortUrl);
app.use("/api", linkGroup);

// Mount redirect routes at the root level
import { getUrl } from "./controllers/shortUrl";
import { getLinkGroupPage } from "./routes/linkGroup";

// Handle group link pages (must come before /:id to avoid conflicts)
app.get("/g/:groupUrl", getLinkGroupPage);

// Handle short URLs
app.get("/:id", getUrl);

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
