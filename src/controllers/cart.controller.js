import { CartService } from "../services/cart.service.js";
const cartService = new CartService();

const addToCart = async (req, res, next) => {
  try {
    await cartService.add(req.userEmail, Number(req.params.productId));
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const getCart = async (req, res, next) => {
  try {
    const result = await cartService.get(req.userEmail);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const removeProductFromCart = async (req, res, next) => {
  try {
    await cartService.removeProduct(
      req.userEmail,
      Number(req.params.productId)
    );
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export default {
  addToCart,
  getCart,
  removeProductFromCart,
};
