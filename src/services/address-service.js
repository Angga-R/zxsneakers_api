import { prismaClient } from "../app/database.js";
import { ResponseError } from "../utils/error_handler/response.error.js";
import addressValidation from "../utils/validations/address.validation.js";
import { validate } from "../utils/validations/validate.js";

const getAddressService = async (userEmail) => {
  const result = await prismaClient.address.findMany({
    where: {
      user_email: userEmail,
    },
  });

  if (result.length < 1) {
    throw new ResponseError(404, "address is empty");
  }

  const data = {
    data: result,
    totalItem: result.length,
  };

  return data;
};

const addAddressService = async (request, userEmail) => {
  const validatedData = validate(addressValidation.add, request);

  const data = {
    user_email: userEmail,
    ...validatedData,
  };

  await prismaClient.address.create({
    data: data,
  });
};

const getAddressByIdService = async (addressId, userEmail) => {
  const result = await prismaClient.address.findUnique({
    where: {
      id: addressId,
      user_email: userEmail,
    },
  });

  if (!result) {
    throw new ResponseError(404, "data not found");
  }

  return result;
};

const updateAddressService = async (request, addressId, userEmail) => {
  const validatedData = validate(addressValidation.add, request);

  await prismaClient.address.update({
    where: {
      id: addressId,
      user_email: userEmail,
    },
    data: validatedData,
  });
};

const deleteAddressService = async (addressId, userEmail) => {
  await prismaClient.address.delete({
    where: {
      id: addressId,
      user_email: userEmail,
    },
  });
};

export {
  getAddressService,
  addAddressService,
  getAddressByIdService,
  updateAddressService,
  deleteAddressService,
};
