import dotenv from "dotenv";
import { ProductRepository } from "../../src/repositories/product.repository.js";
import { UserRepository } from "../../src/repositories/user.repository.js";
import { prismaClient } from "../../src/config/mysql.config.js";
import { OrderRepository } from "../../src/repositories/order.repository.js";
import { CartRepository } from "../../src/repositories/cart.repository.js";
import { AdminRepository } from "../../src/repositories/admin.repository.js";
import { AddressRepository } from "../../src/repositories/address.repository.js";
import { ProductImageRepository } from "../../src/repositories/productImage.repository.js";
import { OrderService } from "../../src/services/order.service.js";

class ServiceTestUtil {
  #user = new UserRepository();
  #address = new AddressRepository();
  #product = new ProductRepository();
  #db = prismaClient;
  #testEmail = "testEmail";
  #testSKU = "testSKU";
  orderService = new OrderService();

  constructor() {
    dotenv.config({ path: ".env.development" });
  }

  async createUserAndAddressTest() {
    const addressMock = {
      no_telp: "080012345678",
      postal_code: "3214321",
      street: "test street",
      sub_distric: "test sub_distric",
      city: "test city",
      province: "test province",
      country: "test country",
    };

    await this.#user.add(this.#testEmail, "testName", "testPassword");
    await this.#address.add(this.#testEmail, addressMock);
    const dataAddress = await this.#address.findByEmail(this.#testEmail);

    return {
      email: this.#testEmail,
      addressId: dataAddress[0].id,
    };
  }

  async deleteUserTest() {
    const testUser = await this.#user.findByEmail(this.#testEmail);

    if (testUser) {
      const dataAddress = await this.#address.findByEmail(this.#testEmail);
      await this.#address.delete(dataAddress[0].id, this.#testEmail);
      await this.#db.user.delete({
        where: {
          email: this.#testEmail,
        },
      });
    }
  }

  async createProductTest() {
    const dataProduct = {
      name: "test",
      description: "description",
      color: "red",
      size: "22",
      price: 2000,
      stock: 22,
    };
    await this.#product.add(this.#testSKU, dataProduct, ["link1", "link2"]);

    const product = await this.#product.findAll(this.#testSKU);

    return product[0].id;
  }

  async deleteProductTest() {
    const product = await this.#product.findAll(this.#testSKU);
    if (product.length > 0) {
      await this.#product.delete(product[0].id);
    }
  }
}

export { ServiceTestUtil };
