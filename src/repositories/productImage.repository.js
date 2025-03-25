import { prismaClient } from "../config/mysql.config.js";

class ProductImageRepository {
  async findByProductId(productId) {
    return prismaClient.product_image.findMany({
      where: {
        product_id: productId,
      },
    });
  }

  async findById(productId, imageId) {
    return prismaClient.product_image.findUnique({
      where: {
        product_id: productId,
        id: imageId,
      },
    });
  }

  async delete(productId, imageId) {
    await prismaClient.product_image.delete({
      where: {
        product_id: productId,
        id: imageId,
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
