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
  const validatedData = validate(updatePasswordAdminValidation, request);

  const checkOldPassword = await prismaClient.admin.findFirst();

  const comparePassword = await bcrypt.compare(
    validatedData.oldPassword,
    checkOldPassword.password
  );
  if (!comparePassword) {
    throw new ResponseError(400, "wrong oldPassword");
  }

  if (validatedData.confirmPassword !== validatedData.newPassword) {
    throw new ResponseError(400, "confirm password not same");
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

export { getEmailAdminService, updatePasswordAdminService };
