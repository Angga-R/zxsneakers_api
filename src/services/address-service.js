import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error-handler/response-error.js";
import { addAddressValidation } from "../validation/address-validation.js";
import { validate } from "../validation/validate.js";

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

const addAddressService = async (request, userEmail) => {
  const validatedData = validate(addAddressValidation, request);

  const data = {
    user_email: userEmail,
    ...validatedData,
  };

  await prismaClient.address.create({
    data: data,
  });
};

export { getAddressService, addAddressService };
