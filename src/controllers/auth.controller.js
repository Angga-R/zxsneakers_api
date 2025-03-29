import ms from "ms";
import { AuthService } from "../services/auth.service.js";
const authService = new AuthService();

const register = async (req, res, next) => {
  try {
    await authService.register(req.body);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const token = await authService.login(req.body);
    const maxAge = ms("1d"); // 1 day
    res
      .cookie("authToken", token, { maxAge: maxAge, httpOnly: true })
      .sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  try {
    res.clearCookie("authToken").sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  logout,
};
