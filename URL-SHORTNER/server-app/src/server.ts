import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDb from "./config/dbConfig";
import shortUrl from "./routes/shortUrl";
import linkGroup from "./routes/linkGroup";
import path from "path";

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

  console.log("Health check success");
});

// Mount API routes under /api
app.use("/api", shortUrl);
app.use("/api", linkGroup);

// Mount redirect routes at the root level
import { getUrl } from "./controllers/shortUrl";
import { getLinkGroupPage } from "./routes/linkGroup";

// Handle group link pages (must come before /:id to avoid conflicts)
app.get("/g/:groupUrl", getLinkGroupPage);

// Handle short URLs redirecting
app.get("/r/:id", getUrl);

// Serve static files from the React app build directory
// Using the correct path resolution for production as per project requirements
app.use(express.static(path.join(__dirname, "..", "dist")));

// Catch-all route to serve the React app for any non-API routes
// This is essential for client-side routing to work properly in production
app.get("*", (req, res) => {
  // Don't serve the React app for API routes or other specific backend routes
  if (
    req.path.startsWith("/api") ||
    req.path.startsWith("/r/") ||
    req.path.startsWith("/g/")
  ) {
    return res.status(404).send("Not Found");
  }

  // Serve the React app's index.html for all other routes
  // Using the correct path resolution for production as per project requirements
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
