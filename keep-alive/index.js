import cron from "node-cron";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Configuration
const BACKEND_URL =
  process.env.BACKEND_URL || "https://scissor-t1hr.onrender.com";
const PING_ENDPOINT = process.env.PING_ENDPOINT || "/api/health";
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "*/14 * * * *"; // Every 14 minutes by default
const PORT = process.env.PORT || 3000;

// Health check endpoint for this service
import http from "http";

const server = http.createServer((req, res) => {
  if (req.url === "/health" || req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        message: "Keep-alive service is running",
        targetUrl: `${BACKEND_URL}${PING_ENDPOINT}`,
        schedule: CRON_SCHEDULE,
        lastPing: lastPingTime || "Not yet pinged",
        nextPing: nextPingTime || "Calculating...",
      })
    );
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Keep-Alive Service started on port ${PORT}`);
  console.log(`📍 Target: ${BACKEND_URL}${PING_ENDPOINT}`);
  console.log(`⏰ Schedule: ${CRON_SCHEDULE}`);
});

// Track ping times
let lastPingTime = null;
let nextPingTime = null;
let pingCount = 0;
let successCount = 0;
let failureCount = 0;

// Ping function
async function pingBackend() {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`\n🔔 [${timestamp}] Pinging backend...`);

  try {
    const response = await axios.get(`${BACKEND_URL}${PING_ENDPOINT}`, {
      timeout: 30000, // 30 second timeout
      headers: {
        "User-Agent": "Scissor-Keep-Alive-Service/1.0",
      },
    });

    const duration = Date.now() - startTime;
    pingCount++;
    successCount++;
    lastPingTime = timestamp;

    console.log(
      `✅ Success! Status: ${response.status} | Response time: ${duration}ms`
    );
    console.log(
      `📊 Stats: Total: ${pingCount} | Success: ${successCount} | Failed: ${failureCount}`
    );

    return { success: true, status: response.status, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    pingCount++;
    failureCount++;
    lastPingTime = timestamp;

    console.error(
      `❌ Failed! Error: ${error.message} | Duration: ${duration}ms`
    );
    console.log(
      `📊 Stats: Total: ${pingCount} | Success: ${successCount} | Failed: ${failureCount}`
    );

    // Log more details for debugging
    if (error.response) {
      console.error(`   Response Status: ${error.response.status}`);
      console.error(`   Response Data:`, error.response.data);
    } else if (error.request) {
      console.error(`   No response received from server`);
    } else {
      console.error(`   Request setup error:`, error.message);
    }

    return { success: false, error: error.message, duration };
  }
}

// Schedule the cron job
console.log("\n⚙️  Setting up cron job...");
const task = cron.schedule(
  CRON_SCHEDULE,
  async () => {
    await pingBackend();
  },
  {
    scheduled: true,
    timezone: "UTC",
  }
);

console.log("✅ Cron job scheduled successfully!");
console.log(`⏰ Cron expression: ${CRON_SCHEDULE}`);
console.log(`🌍 Timezone: UTC`);
console.log("\n📝 Cron Schedule Guide:");
console.log("   */14 * * * *  = Every 14 minutes");
console.log("   */30 * * * *  = Every 30 minutes");
console.log("   0 * * * *     = Every hour");
console.log("   0 */2 * * *   = Every 2 hours");
console.log("   0 0 * * *     = Once a day at midnight");

// Ping immediately on startup
console.log("\n🚀 Performing initial ping...");
pingBackend().then(() => {
  console.log("\n✨ Service is now running and will ping on schedule\n");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n👋 SIGTERM received, shutting down gracefully...");
  task.stop();
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n👋 SIGINT received, shutting down gracefully...");
  task.stop();
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
