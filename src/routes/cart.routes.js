import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import { isUser, verifToken } from "../middleware/auth-middleware.js";

const router = Router();
router.use(verifToken);

router.post("/cart/add/:productId", isUser, cartController.addToCart);
router.get("/cart", isUser, cartController.getCart);
router.delete(
  "/cart/:productId/delete",
  isUser,
  cartController.removeProductFromCart
);

export default router;
