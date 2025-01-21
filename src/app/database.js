import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";
import { logger, loggerDebug } from "./logging.js";

export const prismaClient = new PrismaClient({
  // move all info from stdout to event
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "warn",
    },
    {
      emit: "event",
      level: "info",
    },
  ],
});

export const redisClient = new Redis({
  host: "localhost",
  port: 6379,
  db: 0,
});

// send error info to logger
prismaClient.$on("error", (e) => {
  loggerDebug.error(e);
});
// send to loggerDebug
prismaClient.$on("warn", (e) => {
  loggerDebug.warn(e);
});
prismaClient.$on("info", (e) => {
  loggerDebug.info(e);
});
prismaClient.$on("query", (e) => {
  loggerDebug.info(e);
});
