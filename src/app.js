import express from "express";
import cors from "cors";
import { publicRouter } from "./routes/public-router.js";
import { adminRouter } from "./routes/admin-router.js";
import { userRouter } from "./routes/user-router.js";
import { errorMiddleware } from "./middleware/error-middleware.js";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import config from "./config/config.service.js";
import { loggingMiddleware } from "./middleware/logging.midleware.js";

// load environtment
dotenv.config({ path: `.env.${config.environtment}` });

export const app = express();

app.use(
  cors({
    origin: "http://127.0.0:5500",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
if (config.logging.level === "debug") {
  app.use(loggingMiddleware);
}
app.use(router);
app.use(publicRouter);
app.use(adminRouter);
app.use(userRouter);
app.use(errorMiddleware);
app.use(cookieParser());
