import { bucketName, s3 } from "../app/cloud-config.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error-handler/response-error.js";
import {
  addProductValidation,
  updateProductValidation,
} from "../validation/product-validation.js";
import { validate } from "../validation/validate.js";

const uploadProductImages = async (productImages) => {
  const urls = [];
  const uploadPromises = productImages.map((file) => {
    const parameter = {
      Bucket: bucketName,
      Key: `uploads/product-images/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return new Promise((resolve, reject) => {
      s3.upload(parameter, (err, data) => {
        if (!err) {
          urls.push({ link: data.Location });
          resolve(data.Location);
        } else {
          reject(err);
        }
      });
    });
  });

  await Promise.all(uploadPromises);
  return urls;
};

const deleteProductImg = async (productId, imageId) => {
  if (!imageId) {
    const linkImg = await prismaClient.product_image.findMany({
      where: {
        product_id: productId,
      },
    });

    linkImg.map(async (value) => {
      const parameter = {
        Bucket: bucketName,
        Key: value.link.split(".com/")[1],
      };
      await s3.deleteObject(parameter).promise();
    });
  } else {
    const linkImg = await prismaClient.product_image.findUnique({
      where: {
        product_id: productId,
        id: imageId,
      },
    });

    const key = linkImg.link.split(".com/")[1];

    const parameter = {
      Bucket: bucketName,
      Key: key,
    };

    await s3.deleteObject(parameter).promise();
  }
};

const addProductService = async (request, productImages) => {
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

  const images = await uploadProductImages(productImages);

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

const updateProductService = async (productId, request, productImages) => {
  const validatedData = validate(updateProductValidation, request);
  const countImage = await prismaClient.product_image.count({
    where: {
      product_id: productId,
    },
  });

  if (productImages.length + countImage > 5) {
    throw new ResponseError(
      400,
      "product-images cannot be more than 5 items",
      "product-images"
    );
  }

  const data = {};

  for (const key in validatedData) {
    validatedData[key] ? (data[key] = validatedData[key]) : "";
  }

  const linkImg = await uploadProductImages(productImages);
  data["Product_image"] = {
    createMany: {
      data: linkImg,
    },
  };

  await prismaClient.product.update({
    where: {
      id: productId,
    },
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

const deleteProductImgService = async (productId, imageId) => {
  await deleteProductImg(productId, imageId);

  await prismaClient.product_image.delete({
    where: {
      product_id: productId,
      id: imageId,
    },
  });
};

const deleteProductService = async (productId) => {
  await deleteProductImg(productId);

  await prismaClient.product_image.deleteMany({
    where: {
      product_id: productId,
    },
  });

  await prismaClient.product.delete({
    where: {
      id: productId,
    },
  });
};

export {
  addProductService,
  updateProductService,
  getAllProductService,
  getProductByIdService,
  deleteProductImgService,
  deleteProductService,
};
