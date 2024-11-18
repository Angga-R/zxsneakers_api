import ms from "ms";
import authService from "../services/auth-service.js";

const registerController = async (req, res, next) => {
  try {
    await authService.registerService(req.body);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const token = await authService.loginService(req.body);
    const maxAge = ms("7d"); // 7 day
    res
      .status(200)
      .cookie("token", token, { maxAge: maxAge, httpOnly: true })
      .send();
  } catch (error) {
    next(error);
  }
};

export default {
  registerController,
  loginController,
};
