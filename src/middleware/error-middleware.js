import { ResponseError } from "../error-handler/response-error.js";
import { PrismaClient, Prisma } from "@prisma/client";

export const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  // if error same with ResponseError
  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        errors: err.message,
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
    res
      .status(500)
      .json({
        errors: err.message,
      })
      .end();
  }
};
