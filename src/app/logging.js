import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({}),
    new DailyRotateFile({
      filename: "log/app-%DATE%.log",
      maxSize: "1m", // 1 MB
      maxFiles: "1d", // 1 day
    }),
  ],
});
