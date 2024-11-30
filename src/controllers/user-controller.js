import {
  updateNameService,
  updatePasswordService,
} from "../services/user-service.js";

const updatePasswordController = async (req, res, next) => {
  try {
    await updatePasswordService(req.body, req.userEmail);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const updateNameController = async (req, res, next) => {
  try {
    await updateNameService(req.body.newName, req.userEmail);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export default {
  updatePasswordController,
  updateNameController,
};
