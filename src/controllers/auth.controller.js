import ms from "ms";
import authService from "../services/auth.service.js";

class AuthController {
  async register(req, res, next) {
    try {
      await authService.register(req.body);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const token = await authService.login(req.body);
      const maxAge = ms("1d"); // 1 day
      res
        .cookie("authToken", token, { maxAge: maxAge, httpOnly: true })
        .sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie("authToken").sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
