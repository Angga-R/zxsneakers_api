import { createTransactionService } from "../services/transaction-service.js";

const createTransactionController = async (req, res, next) => {
  try {
    const result = await createTransactionService(req.body, req.userEmail);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default { createTransactionController };
