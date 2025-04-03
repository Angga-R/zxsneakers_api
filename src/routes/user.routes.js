import { Router } from "express";
import { isUser, verifToken } from "../middleware/auth-middleware.js";
import userController from "../controllers/user.controller.js";
import { filterImg } from "../middleware/uploadPicture-middleware.js";

const router = Router();
router.use(verifToken);

router.put("/users/password/update", isUser, userController.updatePassword);
router.put("/users/name/update", isUser, userController.updateName);
router.post(
  "/users/avatar/update",
  isUser,
  filterImg.single("image"),
  userController.updateAvatar
);
router.get("/users/detail", isUser, userController.getUserDetail);

export default router;
