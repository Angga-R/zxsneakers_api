import { ResponseError } from "../error-handler/response-error.js";
import jwt from "jsonwebtoken";
import "dotenv";
import { prismaClient } from "../app/database.js";

export const verifToken = async (req, res, next) => {
  try {
    const { cookie } = req.headers;
    if (!cookie) {
      throw new ResponseError(401, "unauthorize");
    }
    const token = cookie.split("=")[1];
    const email = jwt.verify(
      token,
      process.env.SECRET_KEY,
      (error, payload) => {
        if (error) {
          throw new ResponseError(401, "unauthorize");
        } else {
          return payload.email;
        }
      }
    );

    const isAdmin = await prismaClient.admin.findFirst({
      where: {
        email: email,
      },
    });

    if (isAdmin) {
      req.isAdmin = true;
      next();
    } else {
      const checkEmail = await prismaClient.user.findFirst({
        where: {
          email: email,
        },
        select: {
          email: true,
        },
      });

      if (!checkEmail) {
        throw new ResponseError(401, "unauthorize");
      }

      req.userEmail = checkEmail.email;
      next();
    }
  } catch (error) {
    next(error);
  }
};
