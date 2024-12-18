import { ResponseError } from "../error-handler/response-error.js";

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
