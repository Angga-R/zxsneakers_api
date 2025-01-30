import {
  createOrderService,
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

export default { createOrderController, transactionSuccess };
