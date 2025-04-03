import orderService from "../services/order.service.js";

class OrderController {
  async create(req, res, next) {
    try {
      const result = await orderService.create(req.body, req.userEmail);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async transactionSuccess(req, res, next) {
    try {
      await orderService.transactionSuccess(req.params.orderId, req.userEmail);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async changeStatus(req, res, next) {
    try {
      await orderService.changeStatus(req.params.orderId, req.query.status);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const result = await orderService.getHistory(req.userEmail);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async detailOrder(req, res, next) {
    try {
      const result = await orderService.detailOrder(
        req.params.orderId,
        req.userEmail
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrder(req, res, next) {
    try {
      const result = await orderService.getAllOrder(req.query.status);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
