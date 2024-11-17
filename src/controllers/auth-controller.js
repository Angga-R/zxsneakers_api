import authService from "../services/auth-service.js";

const registerController = async (req, res, next) => {
  try {
    await authService.registerService(req.body);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

export default {
  registerController,
};
