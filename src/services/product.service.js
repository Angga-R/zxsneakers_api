import awsCloud from "../libs/aws.cloud.js";
import { ResponseError } from "../utils/error_handler/response.error.js";
import { validate } from "../utils/validations/validate.js";
import productValidation from "../utils/validations/product.validation.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { ProductImageRepository } from "../repositories/productImage.repository.js";

class ProductService {
  #product = new ProductRepository();
  #productImage = new ProductImageRepository();

  async add(request, productImages) {
    const validatedData = validate(productValidation.add, request);

    const generateSKU = async () => {
      const checkProduct = await this.#product.findAll();
      const id = (
        checkProduct.reduce(
          (max, currentValue) =>
            currentValue.id > max ? currentValue.id : max,
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

    // upload product images to cloud storage
    const imagesUrl = await awsCloud.uploadProductImages(productImages);

    // add data to db
    await this.#product.add(await generateSKU(), validatedData, imagesUrl);
  }

  async update(productId, request, productImages) {
    const validatedData = validate(productValidation.update, request);

    // product images cannot more than 5 images
    const totalImages = await this.#productImage.findByProductId(productId);
    if (productImages.length + totalImages.length > 5) {
      throw new ResponseError(
        400,
        "product-images cannot be more than 5 items",
        "product-images"
      );
    }

    // validating empty data in validatedData
    const data = {};
    for (const key in validatedData) {
      validatedData[key] ? (data[key] = validatedData[key]) : "";
    }

    // upload product images to cloud storage
    const imagesUrl = await awsCloud.uploadProductImages(productImages);

    // update data product in db
    await this.#product.update(productId, data, imagesUrl);
  }

  async getAll(parameter) {
    const skip = (parameter.page - 1) * (parameter.limit ? parameter.limit : 0);
    const data = await this.#product.findAll(
      parameter.search,
      parameter.limit,
      skip,
      true
    );
    const totalData = await this.#product.count(parameter.search);

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
  }

  async getProductById(productId) {
    const product = await this.#product.findById(productId, true);

    if (!product) {
      throw new ResponseError(404, "data not found");
    }

    return product;
  }

  async deleteProductImage(productId, imageId) {
    const productImage = await this.#productImage.findById(productId, imageId);

    // delete product image from cloud storage
    await awsCloud.deleteProductImages(productImage.link, false);

    // delete product image from db
    await this.#productImage.delete(productId, imageId);
  }

  async delete(productId) {
    const productImages = await this.#productImage.findByProductId(productId);
    const urls = [];
    for (const productImage of productImages) {
      urls.push(productImage.link);
    }

    // delete product images from cloud storage
    await awsCloud.deleteProductImages(urls, true);

    // delete product from db
    await this.#product.delete(productId);
  }
}

export default new ProductService();
