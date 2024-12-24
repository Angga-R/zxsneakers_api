import { ResponseError } from "../error-handler/response-error.js";
import { getEmailAdminService } from "../services/admin-service.js";

const getEmailAdminController = async (req, res, next) => {
  try {
    if (!req.isAdmin) {
      throw new ResponseError(403, "Forbidden access");
    }

    const result = await getEmailAdminService();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default { getEmailAdminController };
