import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import addressRoutes from "./address.routes.js";
import cartRoutes from "./cart.routes.js";
import orderRoutes from "./order.routes.js";

const router = Router();

router.use(authRoutes);
router.use(userRoutes);
router.use(addressRoutes);
router.use(cartRoutes);
router.use(orderRoutes);

export default router;
