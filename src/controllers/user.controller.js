import userService from "../services/user.service.js";

class UserController {
  async getUserDetail(req, res, next) {
    try {
      const result = await userService.getUserDetail(req.userEmail);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateName(req, res, next) {
    try {
      await userService.updateName(req.userEmail, req.body.newName);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async updateAvatar(req, res, next) {
    try {
      await userService.updateAvatar(req.userEmail, req.file);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req, res, next) {
    try {
      await userService.updatePassword(req.body, req.userEmail);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
