import express from "express";
import { verifToken, isLogged } from "../middleware/auth-middleware.js";
import authController from "../controllers/auth-controller.js";
import productController from "../controllers/product-controller.js";

const publicRouter = new express.Router();
// auth
publicRouter.post(
  "/auth/register",
  isLogged,
  authController.registerController
);
publicRouter.post("/auth/login", isLogged, authController.loginController);
publicRouter.delete(
  "/auth/logout",
  verifToken,
  authController.logoutController
);
// product
publicRouter.get("/product", productController.getAllProductController);
publicRouter.get("/product/:sku", productController.getProductBySKUController);

export { publicRouter };
