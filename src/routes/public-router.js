import express from "express";
import authController from "../controllers/auth-controller.js";

const publicRouter = new express.Router();
publicRouter.post("/auth/register", authController.registerController);
publicRouter.post("/auth/login", authController.loginController);

export { publicRouter };
