import { prismaClient } from "../app/database.js";
import { createTransactionValidation } from "../validation/transaction-validation.js";
import { validate } from "../validation/validate.js";

const createTransactionService = async (request, userEmail) => {
  const validatedData = validate(createTransactionValidation, request);
  const data = [];
  let product;

  for (let i = 0; i < validatedData.items.length; i++) {
    product = await prismaClient.product.findFirst({
      where: {
        sku: validatedData.items[i].sku,
      },
      include: {
        id: false,
        created_at: false,
        updated_at: false,
        Product_color: {
          select: {
            color: true,
          },
          where: {
            color: validatedData.items[i].color,
          },
        },
        Product_size: {
          select: {
            size: true,
          },
          where: {
            size: validatedData.items[i].size,
          },
        },
      },
    });
    data.push(product);
  }
  // find user include address
  return data;
};

export { createTransactionService };
