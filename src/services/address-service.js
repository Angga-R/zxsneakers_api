import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error-handler/response-error.js";

const getAddressService = async (userEmail) => {
  const result = await prismaClient.address.findMany({
    where: {
      user_email: userEmail,
    },
  });

  if (result.length < 1) {
    throw new ResponseError(400, "address is empty");
  }

  const data = {
    data: result,
    totalItem: result.length,
  };

  return data;
};

export { getAddressService };
