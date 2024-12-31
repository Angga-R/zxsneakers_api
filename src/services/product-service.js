import { prismaClient } from "../app/database.js";
import { addProductValidation } from "../validation/product-validation.js";
import { validate } from "../validation/validate.js";

const addProductService = async (request) => {
  const validatedData = validate(addProductValidation, request);

  const countProductTable = await prismaClient.product.count();
  const productName = validatedData.name.replaceAll(" ", "-");

  const generateSKU = `${countProductTable + 1}_${productName}`;

  // add product to db
  await prismaClient.product.create({
    data: {
      sku: generateSKU,
      name: validatedData.name,
      price: validatedData.price,
      stock: validatedData.stock,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  let colors = [];
  let sizes = [];

  // colors
  for (const color of validatedData.colors) {
    colors.push({ sku_product: generateSKU, color: color });
  }

  // sizes
  for (const size of validatedData.sizes) {
    sizes.push({ sku_product: generateSKU, size: size });
  }

  // add colors to db
  await prismaClient.product_color.createMany({
    data: colors,
  });

  // add sizes to db
  await prismaClient.product_size.createMany({
    data: sizes,
  });
};

export { addProductService };
