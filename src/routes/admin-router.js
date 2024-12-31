import express from "express";
import { verifToken } from "../middleware/auth-middleware.js";
import adminController from "../controllers/admin-controller.js";
import productController from "../controllers/product-controller.js";

const adminRouter = new express.Router();

adminRouter.use(verifToken);

adminRouter.get("/admin/email", adminController.getEmailAdminController);
adminRouter.put(
  "/admin/password/update",
  adminController.updatePasswordAdminController
);

// product
adminRouter.post("/product/add", productController.addProductController);
export { adminRouter };
