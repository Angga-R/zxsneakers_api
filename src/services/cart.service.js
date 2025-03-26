import { CartRepository } from "../repositories/cart.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { ResponseError } from "../utils/error_handler/response.error.js";

class CartService {
  #cart = new CartRepository();
  #product = new ProductRepository();

  async add(email, productId) {
    const checkProduct = await this.#product.findById(productId);

    if (checkProduct) {
      throw new ResponseError(404, "product not found");
    }

    await this.#cart.add(email, productId);
  }

  async get(email) {
    const result = await this.#cart.findByEmail(email);

    if (result.length < 1) {
      throw new ResponseError(404, "empty");
    }

    return {
      data: result,
      totalItem: result.length,
    };
  }

  async removeProduct(email, productId) {
    await this.#cart.delete(email, productId);
  }
}

export { CartService };
