import express from "express";
import { verifToken, isAdmin } from "../middleware/auth-middleware.js";
import adminController from "../controllers/admin-controller.js";
// import productController from "../controllers/product-controller.js";
import productController from "../controllers/product.controller.js";
import { filterImg } from "../middleware/uploadPicture-middleware.js";
import orderController from "../controllers/order-controller.js";

const adminRouter = new express.Router();

adminRouter.use(verifToken);

adminRouter.get(
  "/admin/dashboard",
  isAdmin,
  adminController.dashboardController
);

adminRouter.get(
  "/admin/email",
  isAdmin,
  adminController.getEmailAdminController
);
adminRouter.put(
  "/admin/password/update",
  isAdmin,
  adminController.updatePasswordAdminController
);

// product
adminRouter.post(
  "/product/add",
  isAdmin,
  filterImg.array("product-images", 5),
  productController.add
);

adminRouter.put(
  "/product/:productId/update",
  isAdmin,
  filterImg.array("product-images", 5),
  productController.update
);

adminRouter.delete(
  "/product/:productId/delete-img/:imgId",
  isAdmin,
  productController.deleteProductImage
);

adminRouter.delete(
  "/product/:productId/delete",
  isAdmin,
  productController.deleteProduct
);

// order
adminRouter.post(
  "/order/:orderId/status",
  isAdmin,
  orderController.changeStatusController
);
adminRouter.get("/order/all", isAdmin, orderController.getAllOrderController);
export { adminRouter };
