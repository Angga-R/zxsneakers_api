import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import { isUser, verifToken } from "../middleware/auth-middleware.js";

const router = Router();
router.use(verifToken);
router.use(isUser);

router.post("/cart/add/:productId", cartController.addToCart);
router.get("/cart", cartController.getCart);
router.delete("/cart/:productId/delete", cartController.removeProductFromCart);

export default router;
