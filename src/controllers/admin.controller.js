import adminService from "../services/admin.service.js";

class AdminController {
  async getDashboard(req, res, next) {
    try {
      const result = await adminService.getDashboard();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getEmail(req, res, next) {
    try {
      const result = await adminService.getEmail();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req, res, next) {
    try {
      await adminService.updatePassword(req.body);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
