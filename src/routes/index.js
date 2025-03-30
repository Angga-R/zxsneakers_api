import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import addressRoutes from "./address.routes.js";

const router = Router();

router.use(authRoutes);
router.use(userRoutes);
router.use(addressRoutes);

export default router;
