import { prismaClient } from "../app/database.js";
import { addProductValidation } from "../validation/product-validation.js";
import { validate } from "../validation/validate.js";

const addProductService = async (request) => {
  const validatedData = validate(addProductValidation, request);

  const countProductTable = await prismaClient.product.count();
  const productName = validatedData.name.replaceAll(" ", "-");

  const generateSKU = `${countProductTable + 1}_${productName}`;
  let colors = [];
  let sizes = [];

  // add color to colors
  for (const color of validatedData.colors) {
    colors.push({ color: color });
  }

  // add size to sizes
  for (const size of validatedData.sizes) {
    sizes.push({ size: size });
  }

  // add product, color, & size to db
  await prismaClient.product.create({
    data: {
      sku: generateSKU,
      name: validatedData.name,
      price: validatedData.price,
      stock: validatedData.stock,
      created_at: new Date(),
      updated_at: new Date(),
      Product_color: {
        createMany: {
          data: colors,
        },
      },
      Product_size: {
        createMany: {
          data: sizes,
        },
      },
    },
    include: {
      Product_color: true,
      Product_size: true,
    },
  });
};

const getAllProductService = async () => {
  let data = await prismaClient.product.findMany({
    include: {
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
  });

  let colors = [];
  let sizes = [];
  let i = 0;

  for (const product of data) {
    colors.push(product.Product_color.map((obj) => obj.color));
    sizes.push(product.Product_size.map((obj) => obj.size));
    product.Product_color = colors[i];
    product.Product_size = sizes[i];
    i++;
  }

  return { data: data, totalItem: data.length };
};

export { addProductService, getAllProductService };
