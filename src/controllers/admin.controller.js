import { AdminService } from "../services/admin.service.js";
const adminService = new AdminService();

const getEmail = async (req, res, next) => {
  try {
    const result = await adminService.getEmail();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    await adminService.updatePassword(req.body);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const result = await adminService.getDashboard();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getEmail,
  updatePassword,
  getDashboard,
};
