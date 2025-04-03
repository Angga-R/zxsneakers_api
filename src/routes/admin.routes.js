import { Router } from "express";
import { verifToken, isAdmin } from "../middleware/auth-middleware.js";
import adminController from "../controllers/admin.controller.js";

const router = Router();
router.use(verifToken);

router.get("/admin/dashboard", isAdmin, adminController.getDashboard);
router.get("/admin/email", isAdmin, adminController.getEmail);
router.put("/admin/password/update", isAdmin, adminController.updatePassword);

export default router;
