import { Router } from "express";
import orderController from "../controllers/order.controller.js";
import { isAdmin, isUser, verifToken } from "../middleware/auth-middleware.js";

const router = Router();
router.use(verifToken);

// user
router.post("/order/create", isUser, orderController.create);
router.post(
  "/order/:orderId/paid",

  isUser,
  orderController.transactionSuccess
);
router.get("/order/history", isUser, orderController.getHistory);
router.get(
  "/order/:orderId/detail",

  isUser,
  orderController.detailOrder
);

// admin
router.post("/order/:orderId/status", isAdmin, orderController.changeStatus);
router.get("/order/all", isAdmin, orderController.getAllOrder);

export default router;
