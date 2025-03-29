import { AddressService } from "../services/address.service.js";
const addressService = new AddressService();

const getAll = async (req, res, next) => {
  try {
    const result = await addressService.getAll(req.userEmail);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    await addressService.add(req.body, req.userEmail);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const getAddressById = async (req, res, next) => {
  try {
    const result = await addressService.getAddressById(
      Number(req.params.addressId),
      req.userEmail
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    await addressService.update(
      req.body,
      Number(req.params.addressId),
      req.userEmail
    );
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    await addressService.delete(Number(req.params.addressId), req.userEmail);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
  add,
  getAddressById,
  update,
  deleteAddress,
};
