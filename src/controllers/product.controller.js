import productService from "../services/product.service.js";

class ProductController {
  async add(req, res, next) {
    try {
      await productService.add(req.body, req.files);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      await productService.update(
        Number(req.params.productId),
        req.body,
        req.files
      );
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const parameter = {
        search: req.query.search,
        page: !req.query.page ? 1 : Number(req.query.page),
        limit: Number(req.query.limit),
      };
      const result = await productService.getAll(parameter);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const result = await productService.getProductById(
        Number(req.params.productId)
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteProductImage(req, res, next) {
    try {
      await productService.deleteProductImage(
        Number(req.params.productId),
        Number(req.params.imgId)
      );
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      await productService.delete(Number(req.params.productId));
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
