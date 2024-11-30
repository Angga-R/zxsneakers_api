import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error-handler/response-error.js";
import { updatePasswordValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validate.js";
import bcrypt from "bcrypt";

const updatePasswordService = async (request, userEmail) => {
  const password = validate(updatePasswordValidation, request);

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
    password.oldPassword,
    user.password
  );

  if (!comparePassword) {
    throw new ResponseError(400, "incorrect old password");
  }

  // check confirmPassword
  if (password.confirmPassword !== password.newPassword) {
    throw new ResponseError(400, "confirm password not same");
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

export { updatePasswordService };
