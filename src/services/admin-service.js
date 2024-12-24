import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error-handler/response-error.js";
import { validate } from "../validation/validate.js";

const getEmailAdminService = async () => {
  return prismaClient.admin.findFirst({
    select: {
      email: true,
    },
  });
};

export { getEmailAdminService };
