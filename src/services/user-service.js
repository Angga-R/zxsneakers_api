import { bucketName, s3 } from "../app/cloud-config.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error-handler/response-error.js";
import {
  updateNameValidation,
  updatePasswordValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validate.js";
import bcrypt from "bcrypt";

const uploadUserImg = async (image) => {
  const parameter = {
    Bucket: bucketName,
    Key: `uploads/avatar/${Date.now()}_${image.originalname}`,
    Body: image.buffer,
    ContentType: image.mimetype,
  };

  const url = await s3
    .upload(parameter, (err, data) => {
      if (!err) {
        return data;
      }
    })
    .promise();

  return url.Location;
};

const deleteUserImg = async (userEmail) => {
  const linkImg = await prismaClient.user.findUnique({
    where: {
      email: userEmail,
    },
  });
  const key = linkImg.avatar.split(".com/")[1];

  const parameter = {
    Bucket: bucketName,
    Key: key,
  };

  await s3.deleteObject(parameter).promise();
};

const getUserDetailService = async (userEmail) => {
  return prismaClient.user.findFirst({
    where: {
      email: userEmail,
    },
    select: {
      email: true,
      name: true,
      avatar: true,
    },
  });
};

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

  let comparePassword = await bcrypt.compare(
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

  comparePassword = await bcrypt.compare(password.newPassword, user.password);

  // if newPassword = current password, dont do query
  if (comparePassword) {
    return;
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

const updateAvatarService = async (userEmail, image) => {
  await deleteUserImg(userEmail);

  const url = await uploadUserImg(image);

  // update profile
  await prismaClient.user.update({
    where: {
      email: userEmail,
    },
    data: {
      avatar: url,
    },
  });
};

export {
  updatePasswordService,
  updateNameService,
  updateAvatarService,
  getUserDetailService,
};
