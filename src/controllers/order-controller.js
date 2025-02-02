import {
  changeStatusService,
  createOrderService,
  detailOrderService,
  getAllOrderService,
  getHistoryService,
  transactionSuccessService,
} from "../services/order-service.js";

const createOrderController = async (req, res, next) => {
  try {
    const result = await createOrderService(req.body, req.userEmail);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const transactionSuccess = async (req, res, next) => {
  try {
    await transactionSuccessService(req.params.orderId, req.userEmail);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const changeStatusController = async (req, res, next) => {
  try {
    await changeStatusService(req.params.orderId, req.query.status);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const getHistoryController = async (req, res, next) => {
  try {
    const result = await getHistoryService(req.userEmail);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const detailOrderController = async (req, res, next) => {
  try {
    const result = await detailOrderService(req.userEmail, req.params.orderId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllOrderController = async (req, res, next) => {
  try {
    const result = await getAllOrderService(req.query.status);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  createOrderController,
  transactionSuccess,
  changeStatusController,
  getHistoryController,
  detailOrderController,
  getAllOrderController,
};
