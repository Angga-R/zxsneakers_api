import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error-handler/response-error.js";
import { updatePasswordAdminValidation } from "../validation/admin-validation.js";
import { validate } from "../validation/validate.js";
import bcrypt from "bcrypt";

const getEmailAdminService = async () => {
  return prismaClient.admin.findFirst({
    select: {
      email: true,
    },
  });
};

const updatePasswordAdminService = async (request) => {
  const checkOldPassword = await prismaClient.admin.findFirst();

  let comparePassword = await bcrypt.compare(
    request.oldPassword,
    checkOldPassword.password
  );
  if (!comparePassword) {
    throw new ResponseError(400, "incorrect old password", "oldPassword");
  }

  const validatedData = validate(updatePasswordAdminValidation, request);

  if (validatedData.confirmPassword !== validatedData.newPassword) {
    throw new ResponseError(
      400,
      "confirm password not same",
      "confirmPassword"
    );
  }

  comparePassword = await bcrypt.compare(
    validatedData.newPassword,
    checkOldPassword.password
  );

  if (comparePassword) {
    return;
  }

  const newPassword = await bcrypt.hash(validatedData.newPassword, 10);

  await prismaClient.admin.update({
    where: {
      email: checkOldPassword.email,
    },
    data: {
      password: newPassword,
    },
  });
};

const dashboardService = async () => {
  const response = {
    active_user: 0,
    total_products: 0,
    total_orders: 0,
    total_order_complete: 0,
    total_order_incomplete: 0,
    total_income: 0,
  };

  response.active_user = await prismaClient.user.count();
  response.total_products = await prismaClient.product.count();
  response.total_orders = await prismaClient.order.count();
  response.total_order_complete = await prismaClient.order.count({
    where: {
      status: "delivered",
    },
  });
  response.total_order_incomplete = await prismaClient.order.count({
    where: {
      NOT: {
        status: "delivered",
      },
    },
  });

  const total_income = await prismaClient.order.findMany({
    where: {
      NOT: {
        status: "rejected",
      },
    },
    select: {
      price_total: true,
    },
  });

  response.total_income = total_income.reduce(
    (prevValue, currValue) => prevValue.price_total + currValue.price_total
  );

  return response;
};

export { getEmailAdminService, updatePasswordAdminService, dashboardService };
