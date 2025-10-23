# Scissor Keep-Alive Service

A lightweight Node.js cron job service that keeps your Render-hosted backend alive by pinging it at regular intervals.

## Why This Service?

Render's free tier spins down services after 15 minutes of inactivity. This service prevents that by pinging your backend every 14 minutes (configurable).

## Features

- 🔔 **Automatic Pinging**: Keeps your backend alive with scheduled health checks
- 📊 **Statistics Tracking**: Monitors success/failure rates
- 🚀 **Health Endpoint**: Built-in health check for monitoring
- ⚙️ **Configurable**: Easy to customize ping frequency and target
- 🌍 **UTC Timezone**: Consistent scheduling across regions
- 🔄 **Graceful Shutdown**: Properly handles termination signals
- 📝 **Detailed Logging**: See exactly what's happening

## Setup

### 1. Install Dependencies

```bash
cd keep-alive-service
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Your Render backend URL
BACKEND_URL=https://your-scissor-backend.onrender.com

# Health check endpoint (create this on your backend)
PING_ENDPOINT=/api/health

# Cron schedule (every 14 minutes keeps Render alive)
CRON_SCHEDULE=*/14 * * * *

# Port (Render will override this)
PORT=3000
```

### 3. Add Health Endpoint to Your Backend

Add this to your Express backend (`server-app/src/server.ts`):

```javascript
// Health check endpoint for keep-alive service
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend is alive",
    timestamp: new Date().toISOString(),
  });
});
```

### 4. Run Locally

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## Deployment to Render

### 1. Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `scissor-keep-alive`
   - **Region**: Same as your backend (for faster pings)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `keep-alive-service`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2. Set Environment Variables

In Render dashboard, add these environment variables:

```
BACKEND_URL=https://your-scissor-backend.onrender.com
PING_ENDPOINT=/api/health
CRON_SCHEDULE=*/14 * * * *
```

### 3. Deploy

Click **"Create Web Service"** and wait for deployment.

## Cron Schedule Examples

The service uses standard cron syntax:

```
*    *    *    *    *
┬    ┬    ┬    ┬    ┬
│    │    │    │    │
│    │    │    │    └─ Day of week (0-7, 0 or 7 is Sunday)
│    │    │    └────── Month (1-12)
│    │    └─────────── Day of month (1-31)
│    └──────────────── Hour (0-23)
└───────────────────── Minute (0-59)
```

### Common Schedules:

- `*/14 * * * *` - Every 14 minutes (recommended for Render free tier)
- `*/10 * * * *` - Every 10 minutes
- `*/30 * * * *` - Every 30 minutes
- `0 * * * *` - Every hour
- `0 */2 * * *` - Every 2 hours
- `0 0 * * *` - Once daily at midnight

## Monitoring

### Check Service Status

Visit your deployed service URL:

```
https://your-keep-alive-service.onrender.com/health
```

Response:

```json
{
  "status": "ok",
  "message": "Keep-alive service is running",
  "targetUrl": "https://your-backend.onrender.com/api/health",
  "schedule": "*/14 * * * *",
  "lastPing": "2025-01-20T10:30:00.000Z",
  "nextPing": "2025-01-20T10:44:00.000Z"
}
```

### View Logs

In Render dashboard:

1. Go to your keep-alive service
2. Click **"Logs"** tab
3. You'll see logs like:

```
🚀 Keep-Alive Service started on port 3000
📍 Target: https://your-backend.onrender.com/api/health
⏰ Schedule: */14 * * * *

🔔 [2025-01-20T10:30:00.000Z] Pinging backend...
✅ Success! Status: 200 | Response time: 245ms
📊 Stats: Total: 1 | Success: 1 | Failed: 0
```

## How It Works

1. **Startup**: Service starts and pings immediately
2. **Scheduling**: Cron job runs based on `CRON_SCHEDULE`
3. **Pinging**: Makes HTTP GET request to your backend
4. **Logging**: Logs success/failure with response times
5. **Statistics**: Tracks total pings, successes, and failures
6. **Health Check**: Exposes `/health` endpoint for monitoring

## Important Notes

### Render Free Tier Limitations

- **Spin Down Time**: 15 minutes of inactivity
- **Monthly Bandwidth**: 100 GB
- **Solution**: Ping every 14 minutes to stay alive

### Both Services on Free Tier

If both your backend AND keep-alive service are on Render free tier:

- The keep-alive service will ALSO spin down
- Consider using an external cron service (like cron-job.org)
- OR upgrade one service to paid tier

### Alternative: External Cron Services

If you don't want to host this on Render, use:

1. **Cron-Job.org** (Free): https://cron-job.org

   - Create account
   - Add new cron job
   - URL: `https://your-backend.onrender.com/api/health`
   - Interval: Every 14 minutes

2. **UptimeRobot** (Free): https://uptimerobot.com

   - Monitors and pings your service
   - 5-minute intervals on free tier

3. **Easycron** (Free): https://www.easycron.com
   - Simple cron job setup
   - Email notifications

## Cost Optimization

### Option 1: External Cron + Render Free Tier

- **Cost**: $0/month
- **Setup**: Use cron-job.org to ping your Render backend
- **Pros**: Completely free
- **Cons**: Depends on external service

### Option 2: Keep-Alive Service + Render Free Backend

- **Cost**: $0/month (but both can spin down)
- **Reliability**: Low (both spin down together)
- **Not Recommended**

### Option 3: Paid Keep-Alive + Free Backend

- **Cost**: $7/month (Render starter plan)
- **Reliability**: High (keep-alive never spins down)
- **Recommended for production**

## Troubleshooting

### Service Not Pinging

1. Check logs in Render dashboard
2. Verify `BACKEND_URL` is correct
3. Ensure backend health endpoint exists
4. Check if backend is accessible

### Backend Still Spinning Down

1. Verify cron schedule: `*/14 * * * *`
2. Check keep-alive service is running
3. View keep-alive service logs
4. Ensure no errors in pinging

### High Failure Rate

1. Check backend health endpoint returns 200
2. Verify network connectivity
3. Check if backend is overloaded
4. Review error logs for details

## Development

### Local Testing

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# The service will start and ping immediately
# Then follow the cron schedule
```

### Modify Ping Interval

Edit `.env`:

```env
# Ping every 5 minutes (testing)
CRON_SCHEDULE=*/5 * * * *
```

## License

MIT

## Author

Victor Okolo
