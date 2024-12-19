import express from "express";
import authController from "../controllers/auth-controller.js";
import { verifToken } from "../middleware/auth-middleware.js";
import userController from "../controllers/user-controller.js";
import { uploadPicture } from "../middleware/uploadPicture-middleware.js";
import addressController from "../controllers/address-controller.js";

const userRouter = new express.Router();
userRouter.use(verifToken);
userRouter.delete("/auth/logout", authController.logoutController);
// user
userRouter.put(
  "/users/password/update",
  userController.updatePasswordController
);
userRouter.put("/users/name/update", userController.updateNameController);
userRouter.post(
  "/users/avatar/update",
  uploadPicture.single("image"),
  userController.updateAvatarController
);
userRouter.get("/users/avatar", userController.getAvatarController);

// address
userRouter.get("/users/address", addressController.getAddressController);

export { userRouter };
