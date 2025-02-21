import express from "express";
import cors from "cors";
import { publicRouter } from "./routes/public-router.js";
import { adminRouter } from "./routes/admin-router.js";
import { userRouter } from "./routes/user-router.js";
import { errorMiddleware } from "./middleware/error-middleware.js";
import cookieParser from "cookie-parser";

export const app = express();

app.use(
  cors({
    origin: "http://127.0.0:5500",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(publicRouter);
app.use(adminRouter);
app.use(userRouter);
app.use(errorMiddleware);
app.use(cookieParser());
