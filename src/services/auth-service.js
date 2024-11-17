import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error-handler/response-error.js";
import { registerValidation } from "../validation/auth-validation.js";
import { validate } from "../validation/validate.js";
import bcrypt from "bcrypt";

const registerService = async (request) => {
  const user = validate(registerValidation, request);

  const isEmailUsed = await prismaClient.user.count({
    where: {
      email: user.email,
    },
  });

  if (isEmailUsed !== 0) {
    throw new ResponseError(409, "Email already registered");
  }

  user.password = await bcrypt.hash(user.password, 10);

  await prismaClient.user.create({
    data: user,
  });
};

export default {
  registerService,
};
