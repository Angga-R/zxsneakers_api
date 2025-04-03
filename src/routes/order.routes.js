import { Router } from "express";
import orderController from "../controllers/order.controller.js";
import orderControllerTest from "../controllers/order-controller.js";
import { isUser, verifToken } from "../middleware/auth-middleware.js";

const router = Router();

// user
router.post("/order/create", verifToken, isUser, orderController.create);
router.post(
  "/order/:orderId/paid",
  verifToken,
  isUser,
  orderController.transactionSuccess
);
router.get("/order/history", verifToken, isUser, orderController.getHistory);
router.get(
  "/order/:orderId/detail",
  verifToken,
  isUser,
  orderController.detailOrder
);

export default router;
