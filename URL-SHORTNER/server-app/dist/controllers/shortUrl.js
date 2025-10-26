"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUrl = exports.getUrl = exports.createUrl = void 0;
const shortUrl_1 = require("../models/shortUrl");
const valid_url_1 = __importDefault(require("valid-url"));
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default({
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
const createUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullUrl, customUrl } = req.body;
        // Validate the URL
        if (!valid_url_1.default.isUri(fullUrl)) {
            console.log("Invalid URL:", fullUrl);
            return res.status(400).send({ message: "Invalid URL" });
        }
        // Validate custom URL if provided
        if (customUrl) {
            // Check if custom URL is alphanumeric and reasonable length
            if (!/^[a-zA-Z0-9_-]{3,30}$/.test(customUrl)) {
                return res.status(400).send({
                    message: "Custom URL must be 3-30 characters and contain only letters, numbers, hyphens, and underscores",
                });
            }
            // Check if custom URL already exists
            const existingCustomUrl = yield shortUrl_1.urlModel.findOne({ shortUrl: customUrl });
            if (existingCustomUrl) {
                return res.status(409).send({
                    message: "This custom URL is already taken. Please choose another.",
                });
            }
        }
        console.log("Incoming full URL:", fullUrl, "Custom URL:", customUrl);
        const cacheKey = `url:${fullUrl}`;
        // Check Redis cache first (only if no custom URL specified)
        if (!customUrl) {
            const cachedUrl = yield redis.get(cacheKey);
            if (cachedUrl) {
                console.log("Cache hit for URL:", fullUrl);
                return res.status(200).send(JSON.parse(cachedUrl));
            }
            console.log("Cache miss for URL:", fullUrl);
            // Check if URL exists in MongoDB
            const foundUrl = yield shortUrl_1.urlModel.findOne({ fullUrl });
            if (foundUrl) {
                // Cache the found URL
                yield redis.set(cacheKey, JSON.stringify(foundUrl), "EX", 3600); // 1 hour
                console.log("URL found in database and cached:", fullUrl);
                return res.status(409).send(foundUrl); // Conflict: already exists
            }
        }
        // Create a new short URL
        const shortUrlData = { fullUrl };
        if (customUrl) {
            shortUrlData.shortUrl = customUrl;
        }
        const shortUrl = yield shortUrl_1.urlModel.create(shortUrlData);
        // Cache the new URL
        yield redis.set(cacheKey, JSON.stringify(shortUrl), "EX", 3600);
        console.log("New short URL created and cached:", fullUrl);
        return res.status(201).send(shortUrl);
    }
    catch (error) {
        console.error("Error in createUrl:", error);
        return res.status(500).send({ message: "Something went wrong" });
    }
});
exports.createUrl = createUrl;
/**
 * Redirect to the full URL when given a short code.
 */
const getUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortUrl = yield shortUrl_1.urlModel.findOne({ shortUrl: req.params.id });
        if (!shortUrl) {
            return res.status(404).send({ message: "Full URL not found" });
        }
        // Increment click counter
        shortUrl.clicks++;
        yield shortUrl.save();
        return res.redirect(shortUrl.fullUrl);
    }
    catch (error) {
        console.error("Error in getUrl:", error);
        return res.status(500).send({ message: "Something went wrong" });
    }
});
exports.getUrl = getUrl;
/**
 * Delete a short URL by ID.
 */
const deleteUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortUrl = yield shortUrl_1.urlModel.findByIdAndDelete(req.params.id);
        if (!shortUrl) {
            return res.status(404).send({ message: "URL not found" });
        }
        // Remove its cache entry
        const cacheKey = `url:${shortUrl.fullUrl}`;
        yield redis.del(cacheKey);
        console.log(`Deleted URL: ${cacheKey} (short code: ${shortUrl.shortUrl})`);
        return res.status(204).send({ message: "URL successfully deleted" });
    }
    catch (error) {
        console.error("Error deleting URL:", error);
        return res.status(500).send({ message: "Something went wrong" });
    }
});
exports.deleteUrl = deleteUrl;
