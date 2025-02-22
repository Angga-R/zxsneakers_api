import winston, { format } from "winston";
import config from "../config/config.service.js";
import DailyRotateFile from "winston-daily-rotate-file";
import { v4 as uuidV4 } from "uuid";

const customFormat = format.printf(
  ({ timestamp, level, id, message, stack }) => {
    return `${timestamp} ${level.toUpperCase()} ${
      id ? `[ID : ${id}]` : ""
    } : ${JSON.stringify(message)}${
      stack ? " - " + stack : ""
    } \n ----------------`;
  }
);

const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    format.timestamp({ format: "YY-MM-DD HH:mm:ss" }),
    format.splat(),
    format.json(),
    customFormat
  ),
  transports: config.logging.fileLogging
    ? [
        new winston.transports.Console({}),
        new DailyRotateFile({
          filename: "log/%DATE%.log",
          maxSize: "1m", // 1MB
          maxFiles: "1d", // 1 day
        }),
      ]
    : [new winston.transports.Console({})],
});

logger.errorWithID = (message, error) => {
  const errorId = uuidV4();
  logger.error({ id: errorId, message, stack: error?.stack });
  return errorId; // return id for tracing
};

export { logger };
