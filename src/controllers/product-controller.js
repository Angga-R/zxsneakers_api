import {
  addProductService,
  deleteProductService,
  getAllProductService,
  getProductByIdService,
  updateProductService,
} from "../services/product-service.js";

const addProductController = async (req, res, next) => {
  try {
    req.body["images"] = req.files.cloudUrl;
    await addProductService(req.body);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const updateProductController = async (req, res, next) => {
  try {
    req.body["images"] = req.files.cloudUrl;
    await updateProductService(Number(req.params.productId), req.body);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const getAllProductController = async (req, res, next) => {
  try {
    const parameter = {
      search: req.query.search,
      page: !req.query.page ? 1 : Number(req.query.page),
      limit: Number(req.query.limit),
    };
    const result = await getAllProductService(parameter);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getProductByIdController = async (req, res, next) => {
  try {
    const result = await getProductByIdService(Number(req.params.productId));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteProductController = async (req, res, next) => {
  try {
    await deleteProductService(Number(req.params.productId));

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export default {
  addProductController,
  updateProductController,
  getAllProductController,
  getProductByIdController,
  deleteProductController,
};
