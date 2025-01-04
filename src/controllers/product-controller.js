import { ResponseError } from "../error-handler/response-error.js";
import {
  addProductService,
  deleteProductService,
  getAllProductService,
  getProductBySKUService,
} from "../services/product-service.js";

const addProductController = async (req, res, next) => {
  try {
    await addProductService(req.body);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const getAllProductController = async (req, res, next) => {
  try {
    const result = await getAllProductService();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getProductBySKUController = async (req, res, next) => {
  try {
    const result = await getProductBySKUService(req.params.sku);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteProductController = async (req, res, next) => {
  try {
    await deleteProductService(req.params.sku);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export default {
  addProductController,
  getAllProductController,
  getProductBySKUController,
  deleteProductController,
};
