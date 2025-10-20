import express from "express";
import { urlModel } from "../models/shortUrl";
import validUrl from "valid-url";
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
  password: process.env.REDIS_PASSWORD,
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

/**
 * Create a new short URL or return existing one if already stored.
 */
export const createUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { fullUrl } = req.body;

    // Validate the URL
    if (!validUrl.isUri(fullUrl)) {
      console.log("Invalid URL:", fullUrl);
      return res.status(400).send({ message: "Invalid URL" });
    }

    console.log("Incoming full URL:", fullUrl);

    const cacheKey = `url:${fullUrl}`;

    // Check Redis cache first
    const cachedUrl = await redis.get(cacheKey);
    if (cachedUrl) {
      console.log("Cache hit for URL:", fullUrl);
      return res.status(200).send(JSON.parse(cachedUrl));
    }

    console.log("Cache miss for URL:", fullUrl);

    // Check if URL exists in MongoDB
    const foundUrl = await urlModel.findOne({ fullUrl });
    if (foundUrl) {
      // Cache the found URL
      await redis.set(cacheKey, JSON.stringify(foundUrl), "EX", 3600); // 1 hour
      console.log("URL found in database and cached:", fullUrl);
      return res.status(409).send(foundUrl); // Conflict: already exists
    }

    // Create a new short URL
    const shortUrl = await urlModel.create({ fullUrl });

    // Cache the new URL
    await redis.set(cacheKey, JSON.stringify(shortUrl), "EX", 3600);
    console.log("New short URL created and cached:", fullUrl);

    return res.status(201).send(shortUrl);
  } catch (error) {
    console.error("Error in createUrl:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

/**
 * Redirect to the full URL when given a short code.
 */
export const getUrl = async (req: express.Request, res: express.Response) => {
  try {
    const shortUrl = await urlModel.findOne({ shortUrl: req.params.id });
    if (!shortUrl) {
      return res.status(404).send({ message: "Full URL not found" });
    }

    // Increment click counter
    shortUrl.clicks++;
    await shortUrl.save();

    return res.redirect(shortUrl.fullUrl);
  } catch (error) {
    console.error("Error in getUrl:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

/**
 * Delete a short URL by ID.
 */
export const deleteUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const shortUrl = await urlModel.findByIdAndDelete(req.params.id);

    if (!shortUrl) {
      return res.status(404).send({ message: "URL not found" });
    }

    // Remove its cache entry
    const cacheKey = `url:${shortUrl.fullUrl}`;
    await redis.del(cacheKey);

    console.log(
      `Deleted URL: ${cacheKey} (short code: ${shortUrl.shortUrl})`
    );

    return res.status(204).send({ message: "URL successfully deleted" });
  } catch (error) {
    console.error("Error deleting URL:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};
