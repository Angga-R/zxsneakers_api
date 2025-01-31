import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error-handler/response-error.js";
import { addProductValidation } from "../validation/product-validation.js";
import { validate } from "../validation/validate.js";

const addProductService = async (request) => {
  const validatedData = validate(addProductValidation, request);

  const generateSKU = async () => {
    const checkProduct = await prismaClient.product.findMany();
    const id = (
      checkProduct.reduce(
        (max, currentValue) => (currentValue.id > max ? currentValue.id : max),
        0
      ) + 1
    )
      .toString()
      .padStart(3, "0");
    const color = validatedData.color
      ? validatedData.color.slice(0, 3).toUpperCase()
      : "NOCLR";

    return `ZXS-${color}-${validatedData.size}-${id}`;
  };

  const images = [];

  // add image to images
  for (const image of validatedData.images) {
    images.push({ link: image });
  }

  delete validatedData["images"];

  const data = {
    sku: await generateSKU(),
    ...validatedData,
    created_at: new Date(),
    updated_at: new Date(),
    Product_image: {
      createMany: {
        data: images,
      },
    },
  };

  // add product, color, & size to db
  await prismaClient.product.create({
    data: data,
    include: {
      Product_image: true,
    },
  });
};

const getAllProductService = async (parameter) => {
  const searchQuery = {
    OR: [
      {
        sku: {
          contains: parameter.search ? parameter.search : "",
        },
      },
      {
        name: {
          contains: parameter.search ? parameter.search : "",
        },
      },
    ],
  };
  const totalData = await prismaClient.product.count({
    where: searchQuery,
  });
  let data;
  const skip = (parameter.page - 1) * parameter.limit ? parameter.limit : 0;
  data = await prismaClient.product.findMany({
    where: searchQuery,
    take: parameter.limit ? parameter.limit : totalData,
    skip: skip,
    include: {
      created_at: false,
      updated_at: false,
      Product_image: {
        select: {
          link: true,
        },
      },
    },
  });

  return {
    data: data,
    paging: {
      page: parameter.limit && totalData !== 0 ? parameter.page : 1,
      totalPage:
        parameter.limit && totalData !== 0
          ? Math.ceil(totalData / parameter.limit)
          : 1,
      totalItem: totalData,
    },
  };
};

const getProductByIdService = async (productId) => {
  let product = await prismaClient.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      Product_image: {
        select: {
          id: true,
          link: true,
        },
      },
    },
  });

  if (!product) {
    throw new ResponseError(404, "data not found");
  }

  return product;
};

const deleteProductService = async (productId) => {
  await prismaClient.product.delete({
    where: {
      id: productId,
    },
  });
};

export {
  addProductService,
  getAllProductService,
  getProductByIdService,
  deleteProductService,
};
