import { Router } from "express";
import { isLogged, verifToken } from "../middleware/auth.middleware.js";
import authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/register", isLogged, authController.register);
router.post("/auth/login", isLogged, authController.login);
router.delete("/auth/logout", verifToken, authController.logout);

export default router;
