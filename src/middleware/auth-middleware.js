import { ResponseError } from "../error-handler/response-error.js";
import jwt from "jsonwebtoken";
import "dotenv";
import { prismaClient } from "../app/database.js";

const verifToken = async (req, res, next) => {
  try {
    const { cookie } = req.headers;
    if (!cookie) {
      throw new ResponseError(401, "unauthorized");
    }
    const token = cookie.split("=")[1];
    const email = jwt.verify(
      token,
      process.env.SECRET_KEY,
      (error, payload) => {
        if (error) {
          throw new ResponseError(401, "unauthorized");
        } else {
          return payload.email;
        }
      }
    );

    const admin = await prismaClient.admin.findFirst({
      where: {
        email: email,
      },
    });

    if (admin) {
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
        throw new ResponseError(401, "unauthorized");
      }

      req.userEmail = checkEmail.email;
      next();
    }
  } catch (error) {
    next(error);
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (req.userEmail) {
      throw new ResponseError(403, "Forbidden access");
    } else if (req.isAdmin) {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const isUser = (req, res, next) => {
  try {
    if (req.isAdmin) {
      throw new ResponseError(403, "Forbidden access");
    } else if (req.userEmail) {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const isLogged = (req, res, next) => {
  try {
    const { cookie } = req.headers;
    if (cookie) {
      const token = cookie.split("=")[1];
      jwt.verify(token, process.env.SECRET_KEY, (error) => {
        if (error) {
          next();
        } else {
          throw new ResponseError(403, "Forbidden access");
        }
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

export { verifToken, isAdmin, isUser, isLogged };
