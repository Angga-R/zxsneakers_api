import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error-handler/response-error.js";
import {
  loginValidation,
  registerValidation,
} from "../validation/auth-validation.js";
import { validate } from "../validation/validate.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv";

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

const loginService = async (request) => {
  const user = validate(loginValidation, request);

  const findUser = await prismaClient.user.findFirst({
    where: {
      email: user.email,
    },
  });

  if (!findUser) {
    throw new ResponseError(400, "email not registered");
  }

  const isPasswordSame = await bcrypt.compare(user.password, findUser.password);

  if (!isPasswordSame) {
    throw new ResponseError(400, "password is wrong");
  }

  return jwt.sign({ email: user.email }, process.env.SECRET_KEY);
};

export default {
  registerService,
  loginService,
};
