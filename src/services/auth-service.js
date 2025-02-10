import { prismaClient } from "../app/database.js";
import { ResponseError } from "../utils/error_handler/response.error.js";
import { validate } from "../utils/validations/validate.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv";
import authValidation from "../utils/validations/auth.validation.js";

async function confirmPasswordAndMakeJWT(password, encryptedPassword, email) {
  const comparePassword = await bcrypt.compare(password, encryptedPassword);

  if (!comparePassword) {
    throw new ResponseError(400, "password is wrong", "password");
  }

  return jwt.sign({ email: email }, process.env.SECRET_KEY);
}

const registerService = async (request) => {
  const user = validate(authValidation.register, request);

  const isEmailUsedByAdmin = await prismaClient.admin.findFirst({
    where: {
      email: user.email,
    },
  });

  if (isEmailUsedByAdmin) {
    throw new ResponseError(409, "duplicate data");
  }

  user.password = await bcrypt.hash(user.password, 12);

  await prismaClient.user.create({
    data: user,
  });
};

const loginService = async (request) => {
  const validatedData = validate(authValidation.login, request);

  const isAdmin = await prismaClient.admin.findFirst({
    where: {
      email: validatedData.email,
    },
  });

  if (isAdmin) {
    return confirmPasswordAndMakeJWT(
      validatedData.password,
      isAdmin.password,
      validatedData.email
    );
  } else {
    const findUser = await prismaClient.user.findFirst({
      where: {
        email: validatedData.email,
      },
    });

    if (!findUser) {
      throw new ResponseError(400, "email not registered", "email");
    }

    return confirmPasswordAndMakeJWT(
      validatedData.password,
      findUser.password,
      validatedData.email
    );
  }
};

export default {
  registerService,
  loginService,
};
