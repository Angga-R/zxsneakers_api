import { AdminRepository } from "../repositories/admin.repository.js";
import { OrderRepository } from "../repositories/order.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { ResponseError } from "../utils/error_handler/response.error.js";
import adminValidation from "../utils/validations/admin.validation.js";
import { validate } from "../utils/validations/validate.js";
import bcrypt from "bcrypt";

class AdminService {
  #admin = new AdminRepository();
  #user = new UserRepository();
  #product = new ProductRepository();
  #order = new OrderRepository();

  async getEmail() {
    const admin = await this.#admin.getData();

    return admin.email;
  }

  async updatePassword(request) {
    const admin = await this.#admin.getData();

    let comparePassword = await bcrypt.compare(
      request.oldPassword,
      admin.password
    );
    if (!comparePassword) {
      throw new ResponseError(400, "incorrect old password", "oldPassword");
    }

    const validatedData = validate(adminValidation.updatePassword, request);

    if (validatedData.confirmPassword !== validatedData.newPassword) {
      throw new ResponseError(
        400,
        "confirm password not same",
        "confirmPassword"
      );
    }

    comparePassword = await bcrypt.compare(
      validatedData.newPassword,
      admin.password
    );

    if (comparePassword) {
      return;
    }

    const newPassword = await bcrypt.hash(validatedData.newPassword, 10);

    await this.#admin.updatePassword(admin.email, newPassword);
  }

  async getDashboard() {
    const response = {
      active_user: 0,
      total_products: 0,
      total_orders: 0,
      total_order_complete: 0,
      total_order_incomplete: 0,
      total_income: 0,
    };

    const completedOrder = await this.#order.findByStatus("delivered");

    response.active_user = (await this.#user.findAll()).length;
    response.total_products = await this.#product.count();
    response.total_orders = (await this.#order.findAll()).length;
    response.total_order_complete = completedOrder.length;
    response.total_order_incomplete = (
      await this.#order.findByStatus({ not: "delivered" })
    ).length;
    response.total_income = completedOrder.reduce(
      (prevValue, currValue) => prevValue.price_total + currValue.price_total
    );

    return response;
  }
}

export { AdminService };
