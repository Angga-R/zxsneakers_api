import {
  addToCartService,
  deleteProductInCartService,
  getCartService,
} from "../services/cart-service.js";

const addToCartController = async (req, res, next) => {
  try {
    await addToCartService(req.userEmail, req.params.sku);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const getCartController = async (req, res, next) => {
  try {
    const result = await getCartService(req.userEmail);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteProductInCartController = async (req, res, next) => {
  try {
    await deleteProductInCartService(req.userEmail, req.params.sku);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export default {
  addToCartController,
  getCartController,
  deleteProductInCartController,
};
