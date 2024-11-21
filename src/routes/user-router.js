import express from "express";
import authController from "../controllers/auth-controller.js";
import { verifToken } from "../middleware/auth-middleware.js";

const userRouter = new express.Router();
userRouter.use(verifToken);
userRouter.delete("/auth/logout", authController.logoutController);

export { userRouter };
