import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { verifToken, isAdmin } from "../middleware/auth.middleware.js";
import { filterImg } from "../middleware/filterImage.middleware.js";

const router = Router();

// public (No Auth)
router.get("/product", productController.getAll);
router.get("/product/:productId", productController.getProductById);

// admin
router.post(
  "/product/add",
  verifToken,
  isAdmin,
  filterImg.array("product-images", 5),
  productController.add
);

router.put(
  "/product/:productId/update",
  verifToken,
  isAdmin,
  filterImg.array("product-images", 5),
  productController.update
);

router.delete(
  "/product/:productId/delete-img/:imgId",
  verifToken,
  isAdmin,
  productController.deleteProductImage
);

router.delete(
  "/product/:productId/delete",
  verifToken,
  isAdmin,
  productController.deleteProduct
);

export default router;
