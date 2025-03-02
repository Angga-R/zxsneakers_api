import { prismaClient } from "../config/mysql.config.js";

class ProductImageRepository {
  async findByProductId(productId) {
    return prismaClient.product_image.findMany({
      where: {
        product_id: productId,
      },
    });
  }

  async findById(id) {
    return prismaClient.product_image.findUnique({
      where: {
        id: id,
      },
    });
  }

  async delete(id) {
    await prismaClient.product_image.delete({
      where: {
        id: id,
      },
    });
  }

  async deleteByProductId(productId) {
    await prismaClient.product_image.deleteMany({
      where: {
        product_id: productId,
      },
    });
  }
}

export { ProductImageRepository };
