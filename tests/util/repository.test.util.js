import dotenv from "dotenv";
import { ProductRepository } from "../../src/repositories/product.repository.js";
import { UserRepository } from "../../src/repositories/user.repository.js";
import { prismaClient } from "../../src/config/mysql.config.js";
import { OrderRepository } from "../../src/repositories/order.repository.js";
import { CartRepository } from "../../src/repositories/cart.repository.js";
import { AdminRepository } from "../../src/repositories/admin.repository.js";
import { AddressRepository } from "../../src/repositories/address.repository.js";
import { ProductImageRepository } from "../../src/repositories/productImage.repository.js";

class RepositoryTestUtil {
  product = new ProductRepository();
  productImage = new ProductImageRepository();
  user = new UserRepository();
  order = new OrderRepository();
  cart = new CartRepository();
  admin = new AdminRepository();
  address = new AddressRepository();
  db = prismaClient;

  constructor() {
    dotenv.config({ path: ".env.development" });
  }

  productMockData() {
    return {
      name: "test",
      description: "description",
      color: "red",
      size: "22",
      price: 2000,
      stock: 22,
    };
  }

  addressMockData() {
    return {
      no_telp: "080012345678",
      postal_code: "3214321",
      street: "test street",
      sub_distric: "test sub_distric",
      city: "test city",
      province: "test province",
      country: "test country",
    };
  }

  orderMockData(addressId, productId) {
    return {
      id: "testId",
      user_email: "testEmail",
      price_total: 200000,
      created_at: new Date(),
      status: "accepting",
      address_id: addressId,
      Order_detail: {
        createMany: {
          data: [
            {
              product_id: productId,
              price_item: 100000,
              quantity: 2,
              subtotal: 200000,
            },
          ],
        },
      },
    };
  }
}

export { RepositoryTestUtil };
