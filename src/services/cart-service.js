import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error-handler/response-error.js";

const addToCartService = async (userEmail, productSKU) => {
  const checkProduct = await prismaClient.product.count({
    where: {
      sku: productSKU,
    },
  });

  if (checkProduct < 1) {
    throw new ResponseError(404, "product not found");
  }

  await prismaClient.cart.create({
    data: {
      email_user: userEmail,
      sku_product: productSKU,
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
      email_user: userEmail,
    },
    include: {
      email_user: false,
      sku_product: false,
      product: {
        select: {
          sku: true,
          name: true,
          price: true,
          stock: true,
          Product_color: {
            select: {
              color: true,
            },
          },
          Product_size: {
            select: {
              size: true,
            },
          },
        },
      },
    },
  });

  if (!products) {
    throw new ResponseError(404, "empty");
  }

  let colors = [];
  let sizes = [];
  let i = 0;

  for (const data of products) {
    colors.push(data.product.Product_color.map((obj) => obj.color));
    sizes.push(data.product.Product_size.map((obj) => obj.size));
    data.product.Product_color = colors[i];
    data.product.Product_size = sizes[i];
    i++;
  }

  return {
    data: products,
    totalItem: products.length,
  };
};

const deleteProductInCartService = async (userEmail, productSKU) => {
  await prismaClient.cart.delete({
    where: {
      email_user_sku_product: {
        email_user: userEmail,
        sku_product: productSKU,
      },
    },
  });
};

export { addToCartService, getCartService, deleteProductInCartService };
