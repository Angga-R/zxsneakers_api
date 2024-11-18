import express from "express";
import { publicRouter } from "../routes/public-router.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import cookieParser from "cookie-parser";

export const web = express();
web.use(express.json());
web.use(publicRouter);
web.use(errorMiddleware);
web.use(cookieParser());