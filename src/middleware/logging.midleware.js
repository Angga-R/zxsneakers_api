import { logger } from "../libs/logger.js";

export const loggingMiddleware = (req, res, next) => {
  logger.debug(`[${req.method}] ${req.url}`);
  logger.debug(`Header : ${JSON.stringify(req.headers)}`);
  logger.debug(`Body : ${JSON.stringify(req.body)}`);

  next();
};
