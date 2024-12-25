import express from "express";
import { verifToken } from "../middleware/auth-middleware.js";
import adminController from "../controllers/admin-controller.js";

const adminRouter = new express.Router();

adminRouter.use(verifToken);

adminRouter.get("/admin/email", adminController.getEmailAdminController);
adminRouter.put(
  "/admin/password/update",
  adminController.updatePasswordAdminController
);
export { adminRouter };
