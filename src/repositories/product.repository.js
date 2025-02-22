import { prismaClient } from "../config/mysql.config.js";

class ProductRepository {
  async findAll(searchData, limit, skip, isIncludeProductImage) {
    const query = {};
    if (searchData) {
      query["where"] = {
        OR: [
          {
            sku: {
              contains: searchData,
            },
          },
          {
            name: {
              contains: searchData,
            },
          },
        ],
      };
    }

    if (limit) {
      query["take"] = limit;
    }

    if (skip) {
      query["skip"] = skip;
    }

    if (isIncludeProductImage) {
      query["include"] = {
        Product_image: {
          select: {
            link: true,
          },
        },
      };
    }

    return prismaClient.product.findMany(query);
  }

  async findById(id, isIncludeProductImage) {
    const query = {
      where: {
        id: id,
      },
    };

    if (isIncludeProductImage) {
      query["include"] = {
        Product_image: {
          select: {
            id: true,
            link: true,
          },
        },
      };
    }

    return prismaClient.product.findUnique(query);
  }

  async count(searchData) {
    const query = {};

    if (searchData) {
      query["where"] = {
        OR: [
          {
            sku: {
              contains: searchData,
            },
          },
          {
            name: {
              contains: searchData,
            },
          },
        ],
      };
    }

    return prismaClient.product.count(query);
  }

  async add(sku, data, images) {
    const linkImg = [];
    for (const link of images) {
      linkImg.push({ link: link });
    }
    await prismaClient.product.create({
      data: {
        sku: sku,
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
        Product_image: {
          createMany: {
            data: linkImg,
          },
        },
      },
    });
  }

  async update(id, data, newImageUrls) {
    if (newImageUrls) {
      const imageUrls = [];
      for (const url of newImageUrls) {
        imageUrls.push({ link: url });
      }

      data["Product_image"] = {
        createMany: {
          data: imageUrls,
        },
      };
    }

    data["updated_at"] = new Date();

    await prismaClient.product.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  async delete(id) {
    await prismaClient.product_image.deleteMany({
      where: {
        product_id: id,
      },
    });

    await prismaClient.product.delete({
      where: {
        id: id,
      },
    });
  }
}

export { ProductRepository };
