import express from "express";
import { verifToken, isAdmin } from "../middleware/auth-middleware.js";
import adminController from "../controllers/admin-controller.js";
import productController from "../controllers/product-controller.js";

const adminRouter = new express.Router();

adminRouter.use(verifToken);
adminRouter.use(isAdmin);

adminRouter.get("/admin/email", adminController.getEmailAdminController);
adminRouter.put(
  "/admin/password/update",
  adminController.updatePasswordAdminController
);

// product
adminRouter.post("/product/add", productController.addProductController);
adminRouter.delete(
  "/product/:sku/delete",
  productController.deleteProductController
);
export { adminRouter };
