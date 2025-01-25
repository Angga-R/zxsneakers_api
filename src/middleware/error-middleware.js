import { logger } from "../app/logging.js";
import { ResponseError } from "../error-handler/response-error.js";
import { Prisma } from "@prisma/client";

export const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  const isJson = (data) => {
    if (typeof data !== "string") {
      return false;
    }
    try {
      const parsed = JSON.parse(data);
      return typeof parsed === "object" && parsed !== null;
    } catch (e) {
      return false;
    }
  };

  // if error same with ResponseError
  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        errors: isJson(err.message) ? JSON.parse(err.message) : err.message,
      })
      .end();
    // errorn handling for limit file size
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      if (err.meta.target === "PRIMARY") {
        res
          .status(409)
          .json({
            errors: "duplicate data",
          })
          .end();
      }
    } else if (err.code === "P2025") {
      res
        .status(404)
        .json({
          errors: "data not found",
        })
        .end();
    }
  } else if (err.code == "LIMIT_FILE_SIZE") {
    res
      .status(400)
      .json({
        errors: "file is too large. maximum limit is 1MB",
      })
      .end();
  } else {
    // cant understood error
    const errorId = logger.errorWithID("Error occurred in application", err);
    res
      .status(500)
      .json({
        errors: "Internal Server Error",
        errorID: errorId,
      })
      .end();
  }
};
