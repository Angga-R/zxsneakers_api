import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error-handler/response-error.js";
import { addressValidation } from "../validation/address-validation.js";
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
  const validatedData = validate(addressValidation, request);

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
    throw new ResponseError(404, "address not found");
  }

  return result;
};

const updateAddressService = async (request, addressId, userEmail) => {
  const validatedData = validate(addressValidation, request);

  const checkAddress = await prismaClient.address.count({
    where: {
      id: addressId,
      user_email: userEmail,
    },
  });

  if (checkAddress < 1) {
    throw new ResponseError(404, "address not found");
  }

  await prismaClient.address.update({
    where: {
      id: addressId,
      user_email: userEmail,
    },
    data: validatedData,
  });
};

const deleteAddressService = async (addressId, userEmail) => {
  const checkAddress = await prismaClient.address.count({
    where: {
      id: addressId,
      user_email: userEmail,
    },
  });

  if (checkAddress < 1) {
    throw new ResponseError(404, "address not found");
  }

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
