import { PrismaClient } from "@prisma/client";
import { logger } from "./logging.js";

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

// send all info to logger
prismaClient.$on("error", (e) => {
  logger.error(e);
});
prismaClient.$on("warn", (e) => {
  logger.warn(e);
});
prismaClient.$on("info", (e) => {
  logger.info(e);
});
prismaClient.$on("query", (e) => {
  logger.info(e);
});
