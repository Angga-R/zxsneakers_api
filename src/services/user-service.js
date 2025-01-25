import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error-handler/response-error.js";
import {
  updateNameValidation,
  updatePasswordValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validate.js";
import bcrypt from "bcrypt";

const updatePasswordService = async (request, userEmail) => {
  // check old password
  const user = await prismaClient.user.findFirst({
    where: {
      email: userEmail,
    },
    select: {
      password: true,
    },
  });

  const comparePassword = await bcrypt.compare(
    request.oldPassword,
    user.password
  );

  if (!comparePassword) {
    throw new ResponseError(400, "incorrect old password", "oldPassword");
  }

  const password = validate(updatePasswordValidation, request);

  // check confirmPassword
  if (password.confirmPassword !== password.newPassword) {
    throw new ResponseError(
      400,
      "confirm password not same",
      "confirmPassword"
    );
  }

  // encrypt new password
  const encryptedPassword = await bcrypt.hash(password.newPassword, 10);

  await prismaClient.user.update({
    where: {
      email: userEmail,
    },
    data: {
      password: encryptedPassword,
    },
  });
};

const updateNameService = async (newName, userEmail) => {
  newName = validate(updateNameValidation, newName);

  await prismaClient.user.update({
    where: {
      email: userEmail,
    },
    data: {
      name: newName,
    },
  });
};

const updateAvatarService = async (requestFile, userEmail) => {
  const checkDataProfile = await prismaClient.profile_image.count({
    where: {
      user_email: userEmail,
    },
  });

  if (checkDataProfile === 0) {
    // create new record
    await prismaClient.profile_image.create({
      data: {
        user_email: userEmail,
        name: requestFile.originalname,
        format: requestFile.mimetype,
        data_image: requestFile.buffer,
      },
    });
  } else {
    // update profile
    await prismaClient.profile_image.update({
      where: {
        user_email: userEmail,
      },
      data: {
        name: requestFile.originalname,
        format: requestFile.mimetype,
        data_image: requestFile.buffer,
      },
    });
  }
};

const getAvatarService = async (userEmail) => {
  return prismaClient.profile_image.findFirst({
    where: {
      user_email: userEmail,
    },
  });
};

export {
  updatePasswordService,
  updateNameService,
  updateAvatarService,
  getAvatarService,
};
