import { prismaClient } from "../config/mysql.config.js";
import { ResponseError } from "../utils/error_handler/response.error.js";
import { validate } from "../utils/validations/validate.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv";
import authValidation from "../utils/validations/auth.validation.js";
import { AdminRepository } from "../repositories/admin.repository.js";
import { UserRepository } from "../repositories/user.repository.js";

async function confirmPasswordAndMakeJWT(password, encryptedPassword, email) {
  const comparePassword = await bcrypt.compare(password, encryptedPassword);

  if (!comparePassword) {
    throw new ResponseError(400, "password is wrong", "password");
  }

  return jwt.sign({ email: email }, process.env.SECRET_KEY);
}

class AuthService {
  admin = new AdminRepository();
  user = new UserRepository();

  async register(request) {
    const user = validate(authValidation.register, request);

    const admin = await this.admin.getData();

    if (user.email === admin.email) {
      throw new ResponseError(409, "duplicate data");
    }

    user.password = await bcrypt.hash(user.password, 12);

    await this.user.add(user.email, user.name, user.password);
  }

  async login(request) {
    const validatedData = validate(authValidation.login, request);

    const admin = await this.admin.getData();

    if (validatedData.email === admin.email) {
      return confirmPasswordAndMakeJWT(
        validatedData.password,
        admin.password,
        validatedData.email
      );
    } else {
      const findUser = await this.user.findByEmail(validatedData.email);

      if (!findUser) {
        throw new ResponseError(400, "email not registered", "email");
      }

      return confirmPasswordAndMakeJWT(
        validatedData.password,
        findUser.password,
        validatedData.email
      );
    }
  }
}

export { AuthService };
