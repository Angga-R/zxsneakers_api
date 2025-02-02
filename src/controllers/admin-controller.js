import {
  dashboardService,
  getEmailAdminService,
  updatePasswordAdminService,
} from "../services/admin-service.js";

const getEmailAdminController = async (req, res, next) => {
  try {
    const result = await getEmailAdminService();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updatePasswordAdminController = async (req, res, next) => {
  try {
    await updatePasswordAdminService(req.body);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const dashboardController = async (req, res, next) => {
  try {
    const result = await dashboardService();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getEmailAdminController,
  updatePasswordAdminController,
  dashboardController,
};
