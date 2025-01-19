import express from "express";
import { publicRouter } from "../routes/public-router.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRouter } from "../routes/user-router.js";
import { adminRouter } from "../routes/admin-router.js";

export const web = express();
web.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
web.use(express.json());
web.use(publicRouter);
web.use(adminRouter);
web.use(userRouter);
web.use(errorMiddleware);
web.use(cookieParser());
