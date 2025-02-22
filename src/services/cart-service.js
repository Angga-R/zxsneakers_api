import { prismaClient } from "../config/mysql.config.js";
import { ResponseError } from "../utils/error_handler/response.error.js";

const addToCartService = async (userEmail, productId) => {
  const checkProduct = await prismaClient.product.count({
    where: {
      id: productId,
    },
  });

  if (checkProduct < 1) {
    throw new ResponseError(404, "product not found");
  }

  await prismaClient.cart.create({
    data: {
      user_email: userEmail,
      product_id: productId,
    },
    include: {
      user: true,
      product: true,
    },
  });
};

const getCartService = async (userEmail) => {
  const products = await prismaClient.cart.findMany({
    where: {
      user_email: userEmail,
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

  if (products.length < 1) {
    throw new ResponseError(404, "empty");
  }

  return {
    data: products,
    totalItem: products.length,
  };
};

const deleteProductInCartService = async (userEmail, productId) => {
  await prismaClient.cart.delete({
    where: {
      user_email_product_id: {
        user_email: userEmail,
        product_id: productId,
      },
    },
  });
};

export { addToCartService, getCartService, deleteProductInCartService };
