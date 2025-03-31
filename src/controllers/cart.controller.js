import cartService from "../services/cart.service.js";

class CartController {
  async addToCart(req, res, next) {
    try {
      await cartService.add(req.userEmail, Number(req.params.productId));
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async getCart(req, res, next) {
    try {
      const result = await cartService.get(req.userEmail);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeProductFromCart(req, res, next) {
    try {
      await cartService.removeProduct(
        req.userEmail,
        Number(req.params.productId)
      );
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}

export default new CartController();
