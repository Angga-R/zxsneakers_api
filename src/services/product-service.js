import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error-handler/response-error.js";
import { addProductValidation } from "../validation/product-validation.js";
import { validate } from "../validation/validate.js";

const addProductService = async (request) => {
  const validatedData = validate(addProductValidation, request);

  const checkProduct = await prismaClient.product.findMany();
  const productName = validatedData.name.replaceAll(" ", "-");
  let generateSKU;

  if (!checkProduct) {
    // if product empty
    generateSKU = `1_${productName.toLowerCase()}`;
  } else {
    const getBiggestId = checkProduct.reduce(
      (max, obj) => (obj.id > max ? obj.id : max),
      0
    );
    generateSKU = `${getBiggestId + 1}_${productName.toLowerCase()}`;
  }
  const colors = [];
  const sizes = [];
  const images = [];

  // add color to colors
  for (const color of validatedData.colors) {
    colors.push({ color: color });
  }

  // add size to sizes
  for (const size of validatedData.sizes) {
    sizes.push({ size: size });
  }

  // add image to images
  for (const image of validatedData.images) {
    images.push({ link: image });
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
      Product_image: {
        createMany: {
          data: images,
        },
      },
    },
    include: {
      Product_color: true,
      Product_size: true,
      Product_image: true,
    },
  });
};

const getAllProductService = async (parameter) => {
  const totalData = await prismaClient.product.count({
    where: {
      name: {
        contains: parameter.search ? parameter.search : "",
      },
    },
  });
  let data;
  const skip = (parameter.page - 1) * parameter.limit ? parameter.limit : 0;
  data = await prismaClient.product.findMany({
    where: {
      name: {
        contains: parameter.search ? parameter.search : "",
      },
    },
    take: parameter.limit ? parameter.limit : totalData,
    skip: skip,
    include: {
      id: false,
      created_at: false,
      updated_at: false,
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
      Product_image: {
        select: {
          link: true,
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

const getProductBySKUService = async (productSKU) => {
  let product = await prismaClient.product.findUnique({
    where: {
      sku: productSKU,
    },
    include: {
      id: false,
      created_at: false,
      updated_at: false,
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
      Product_image: {
        select: {
          link: true,
        },
      },
    },
  });

  if (product) {
    let colors = [];
    let sizes = [];
    let i = 0;
    let j = 0;

    for (const productColor of product.Product_color) {
      colors.push(productColor.color);
      product.Product_color[i] = colors[i];
      i++;
    }

    for (const productSize of product.Product_size) {
      sizes.push(productSize.size);
      product.Product_size[j] = sizes[j];
      j++;
    }

    return product;
  } else {
    throw new ResponseError(404, "data not found");
  }
};

const deleteProductService = async (productSKU) => {
  await prismaClient.product.delete({
    where: {
      sku: productSKU,
    },
  });
};

export {
  addProductService,
  getAllProductService,
  getProductBySKUService,
  deleteProductService,
};
