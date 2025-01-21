import winston, { format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { v4 as uuidV4 } from "uuid";

const customFormat = format.printf(
  ({ timestamp, level, message, id, stack }) => {
    return `${timestamp} [ID : ${id}] ${level.toUpperCase()} : ${message}${
      stack ? " - " + stack : ""
    }`;
  }
);

// untuk error database, satukan ke sini. untuk query biasa, masukan ke dir db(ganti jadi debug)
const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    format.timestamp({ format: "YY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    customFormat
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: "log/app/%DATE%.log",
      maxSize: "1m",
      maxFiles: "1d",
    }),
  ],
});

logger.errorWithID = (message, error) => {
  const errorId = uuidV4();
  logger.error({ id: errorId, message, stack: error?.stack });
  return errorId; // return id for tracing
};

const customDebugFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} ${level.toUpperCase()} : ${JSON.stringify(
    message
  )} \n ----------------`;
});

const loggerDebug = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    format.timestamp({ format: "YY-MM-DD HH:mm:ss" }),
    format.splat(),
    format.json(),
    customDebugFormat
  ),
  transports: [
    new winston.transports.Console({}),
    new DailyRotateFile({
      filename: "log/debug/%DATE%.log",
      maxSize: "1m", // 1 MB
      maxFiles: "1d", // 1 day
    }),
  ],
});

export { logger, loggerDebug };
