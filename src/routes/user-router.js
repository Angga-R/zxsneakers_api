import express from "express";
import authController from "../controllers/auth-controller.js";
import { verifToken } from "../middleware/auth-middleware.js";
import userController from "../controllers/user-controller.js";

const userRouter = new express.Router();
userRouter.use(verifToken);
userRouter.delete("/auth/logout", authController.logoutController);
// user
userRouter.put(
  "/users/password/update",
  userController.updatePasswordController
);
userRouter.put("/users/name/update", userController.updateNameController);

export { userRouter };
