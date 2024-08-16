import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit"; // Import express-rate-limit
import connectDb from "./config/dbConfig";
import shortUrl from "./routes/shortUrl";

dotenv.config();
connectDb();

const port = process.env.PORT || 5000;

const app = express();

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Apply rate limiting to all routes
app.use(limiter);

app.use("/api/", shortUrl);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
