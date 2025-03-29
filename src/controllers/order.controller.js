import { OrderService } from "../services/order.service.js";
const orderService = new OrderService();

const create = async (req, res, next) => {
  try {
    const result = await orderService.create(req.body, req.userEmail);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const transactionSuccess = async (req, res, next) => {
  try {
    await orderService.transactionSuccess(req.params.orderId, req.userEmail);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    await orderService.changeStatus(req.params.orderId, req.query.status);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const result = await orderService.getHistory(req.userEmail);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const detailOrder = async (req, res, next) => {
  try {
    const result = await orderService.detailOrder(
      req.params.orderId,
      req.userEmail
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllOrder = async (req, res, next) => {
  try {
    const result = await orderService.getAllOrder(req.query.status);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  transactionSuccess,
  changeStatus,
  getHistory,
  detailOrder,
  getAllOrder,
};
