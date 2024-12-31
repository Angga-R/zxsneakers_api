import express from "express";
import authController from "../controllers/auth-controller.js";
import productController from "../controllers/product-controller.js";

const publicRouter = new express.Router();
// auth
publicRouter.post("/auth/register", authController.registerController);
publicRouter.post("/auth/login", authController.loginController);
// product
publicRouter.get("/product", productController.getAllProductController);

export { publicRouter };
