import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import addressRoutes from "./address.routes.js";
import cartRoutes from "./cart.routes.js";
import orderRoutes from "./order.routes.js";
import adminRoutes from "./admin.routes.js";
import productRoutes from "./product.routes.js";

const router = Router();

// No Auth
router.use(authRoutes);
// Mix (Auth & No Auth)
router.use(productRoutes);
// Auth
router.use(adminRoutes);
router.use(orderRoutes);
router.use(userRoutes);
router.use(addressRoutes);
router.use(cartRoutes);

export default router;
