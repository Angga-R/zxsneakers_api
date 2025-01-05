import express from "express";
import { verifToken, isUser } from "../middleware/auth-middleware.js";
import userController from "../controllers/user-controller.js";
import { uploadPicture } from "../middleware/uploadPicture-middleware.js";
import addressController from "../controllers/address-controller.js";
import cartController from "../controllers/cart-controller.js";
import transactionController from "../controllers/transaction-controller.js";

const userRouter = new express.Router();
userRouter.use(verifToken);
userRouter.use(isUser);

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
userRouter.post("/users/address/add", addressController.addAddressController);
userRouter.get(
  "/users/address/:addressId",
  addressController.getAddressByIdController
);
userRouter.put(
  "/users/address/:addressId/update",
  addressController.updateAddressController
);
userRouter.delete(
  "/users/address/:addressId/delete",
  addressController.deleteAddressController
);

// cart
userRouter.post("/cart/add/:sku", cartController.addToCartController);
userRouter.get("/cart", cartController.getCartController);
userRouter.delete(
  "/cart/:sku/delete",
  cartController.deleteProductInCartController
);

// transaction
userRouter.post(
  "/transaction/add",
  transactionController.createTransactionController
);

export { userRouter };
