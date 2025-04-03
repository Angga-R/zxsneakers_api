import { Router } from "express";
import addressController from "../controllers/address.controller.js";
import { isUser, verifToken } from "../middleware/auth-middleware.js";

const router = Router();
router.use(verifToken);

router.get("/users/address", isUser, addressController.getAll);
router.get(
  "/users/address/:addressId",
  isUser,
  addressController.getAddressById
);
router.post("/users/address/add", isUser, addressController.add);
router.put(
  "/users/address/:addressId/update",
  isUser,
  addressController.update
);
router.delete(
  "/users/address/:addressId/delete",
  isUser,
  addressController.delete
);

export default router;
