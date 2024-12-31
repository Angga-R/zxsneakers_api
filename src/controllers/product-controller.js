import { ResponseError } from "../error-handler/response-error.js";
import { addProductService } from "../services/product-service.js";

const addProductController = async (req, res, next) => {
  try {
    if (!req.isAdmin) {
      throw new ResponseError(403, "Forbidden access");
    }
    await addProductService(req.body);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export default { addProductController };
