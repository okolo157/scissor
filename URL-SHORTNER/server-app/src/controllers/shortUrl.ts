import express from "express";
import { urlModel } from "../models/shortUrl";
import validUrl from "valid-url";
import Redis from "ioredis";

const redis = new Redis({
  host: "redis-18499.c341.af-south-1-1.ec2.redns.redis-cloud.com",
  port: 18499,
  password: "YWjweWQiCVFu2YfDDKQFddIXdsLBKXOM",
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export const createUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { fullUrl } = req.body;

    // Validate the URL
    if (!validUrl.isUri(fullUrl)) {
      console.log("Invalid URL:", fullUrl, " please input a valid url"); // Log invalid URL
      return res.status(400).send({ message: "Invalid URL" });
    }

    console.log("The full URL is:", fullUrl);

    // Construct cache key based on the full URL
    const cacheKey = `url:${fullUrl}`;

    // Check cache first
    const cachedUrl = await redis.get(cacheKey);
    if (cachedUrl) {
      console.log("Cache hit for URL:", fullUrl); // Log cache hit
      return res.status(200).send(JSON.parse(cachedUrl));
    } else {
      console.log("Cache miss for URL:", fullUrl); // Log cache miss

      // If URL is not in cache, query the database
      const foundUrl = await urlModel.findOne({ fullUrl });
      if (foundUrl) {
        // Store result in cache
        await redis.set(cacheKey, JSON.stringify(foundUrl), "EX", 3600); // Cache for 1 hour
        console.log("URL found in database and cached:", fullUrl);

        // Invalidate the cache for all URLs
        await redis.del("all_urls");

        return res.status(409).send(foundUrl); // Conflict if URL already exists
      } else {
        // Create new short URL and store in database
        const shortUrl = await urlModel.create({ fullUrl });
        // Store result in cache
        await redis.set(cacheKey, JSON.stringify(shortUrl), "EX", 3600); // Cache for 1 hour
        console.log("New URL created and cached:", fullUrl);

        // Invalidate the cache for all URLs
        await redis.del("all_urls");

        return res.status(201).send(shortUrl); // Created
      }
    }
  } catch (error) {
    console.error("Error in createUrl:", error); // Log error
    return res.status(500).send({ message: "Something went wrong" });
  }
};

export const getAllUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // Define a cache key for all URLs
    const cacheKey = "all_urls";

    // Check the cache first
    const cachedUrls = await redis.get(cacheKey);

    if (cachedUrls) {
      console.log(
        `[${new Date().toISOString()}] Cache hit:`,
        JSON.stringify(JSON.parse(cachedUrls), null, 2)
      );

      return res.status(200).send(JSON.parse(cachedUrls));
    }

    // If not in cache, query the database
    const shortUrls = await urlModel.find().sort({ createdAt: -1 });
    if (shortUrls.length === 0) {
      return res.status(404).send({ message: "Short URLs not found" });
    }

    // Cache the result
    await redis.setex(cacheKey, 3600, JSON.stringify(shortUrls)); // Cache for 1 hour
    console.log(
      `[${new Date().toISOString()}] Cache miss: Fetched from DB and cached (there may have been some changes)`
    );

    // Return URLs from DB after caching
    return res.status(200).send(shortUrls);
  } catch (error) {
    console.error("Error in getAllUrl:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

export const getUrl = async (req: express.Request, res: express.Response) => {
  try {
    const shortUrl = await urlModel.findOne({ shortUrl: req.params.id });
    if (!shortUrl) {
      res.status(404).send({ message: "Full URL not found" });
    } else {
      shortUrl.clicks++;
      shortUrl.save();
      res.redirect(`${shortUrl.fullUrl}`);
    }
  } catch (error) {
    res.status(500).send({ message: "Full URL not found" });
  }
};



export const deleteUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const shortUrl = await urlModel.findByIdAndDelete(req.params.id);

    if (shortUrl) {
      // Construct cache key based on the shortUrl's ID or unique identifier
      const cacheKey = `url:${shortUrl.fullUrl}`;

      // Delete the cache entry
      await redis.del(cacheKey);
      console.log(
        `Full URL ${cacheKey} associated with short URL ${shortUrl.shortUrl} deleted successfully`
      );

      // Invalidate the cache for all URLs
      await redis.del("all_urls");

      res.status(204).send({ message: "Requested URL successfully deleted" });
    } else {
      res.status(404).send({ message: "URL not found" });
    }
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).send({ message: "Something went wrong" });
  }
};
