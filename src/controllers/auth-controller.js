import ms from "ms";
import authService from "../services/auth-service.js";

const registerController = async (req, res, next) => {
  try {
    await authService.registerService(req.body);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const token = await authService.loginService(req.body);
    const maxAge = ms("1d"); // 1 day
    res
      .status(200)
      .cookie("authToken", token, { maxAge: maxAge, httpOnly: true })
      .send();
  } catch (error) {
    next(error);
  }
};

const logoutController = (req, res, next) => {
  try {
    res.clearCookie("authToken").sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export default {
  registerController,
  loginController,
  logoutController,
};
