import express from "express";
import { publicRouter } from "../routes/public-router.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import cookieParser from "cookie-parser";
import { userRouter } from "../routes/user-router.js";
import { adminRouter } from "../routes/admin-router.js";

export const web = express();
web.use(express.json());
web.use(publicRouter);
web.use(userRouter);
web.use(adminRouter);
web.use(errorMiddleware);
web.use(cookieParser());
