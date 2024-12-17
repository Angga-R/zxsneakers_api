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
