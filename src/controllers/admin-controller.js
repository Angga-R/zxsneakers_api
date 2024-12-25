import { ResponseError } from "../error-handler/response-error.js";
import {
  getEmailAdminService,
  updatePasswordAdminService,
} from "../services/admin-service.js";

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

const updatePasswordAdminController = async (req, res, next) => {
  try {
    if (!req.isAdmin) {
      throw new ResponseError(403, "Forbidden access");
    }
    await updatePasswordAdminService(req.body);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export default { getEmailAdminController, updatePasswordAdminController };
