import { Router } from "express";
import addressController from "../controllers/address.controller.js";
import { isUser, verifToken } from "../middleware/auth-middleware.js";

const router = Router();
router.use(verifToken);
router.use(isUser);

router.get("/users/address", addressController.getAll);
router.get("/users/address/:addressId", addressController.getAddressById);
router.post("/users/address/add", addressController.add);
router.put("/users/address/:addressId/update", addressController.update);
router.delete("/users/address/:addressId/delete", addressController.delete);

export default router;
