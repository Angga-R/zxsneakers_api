import { prismaClient } from "../config/mysql.config.js";

class CartRepository {
  async add(email, productId) {
    await prismaClient.cart.create({
      data: {
        user_email: email,
        product_id: productId,
      },
    });
  }

  async delete(email, productId) {
    await prismaClient.cart.delete({
      where: {
        user_email_product_id: {
          user_email: email,
          product_id: productId,
        },
      },
    });
  }

  async findByEmail(email) {
    return prismaClient.cart.findMany({
      where: {
        user_email: email,
      },
      include: {
        user_email: false,
        product_id: false,
        product: {
          select: {
            id: true,
            name: true,
            color: true,
            size: true,
            price: true,
            stock: true,
            Product_image: {
              select: {
                link: true,
              },
            },
          },
        },
      },
    });
  }
}

export { CartRepository };
