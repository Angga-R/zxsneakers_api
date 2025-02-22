import Redis from "ioredis";
import "dotenv";
import { logger } from "../libs/logger.js";

export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: process.env.REDIS_DB,
});

redisClient.on("error", (err) => {
  logger.errorWithID("Can't connect to Redis Server : ", err);
});

redisClient.on("connect", () => {
  logger.info("Redis Connected");
});
