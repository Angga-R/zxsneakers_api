import {
  addAddressService,
  getAddressByIdService,
  getAddressService,
  updateAddressService,
} from "../services/address-service.js";

const getAddressController = async (req, res, next) => {
  try {
    const result = await getAddressService(req.userEmail);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const addAddressController = async (req, res, next) => {
  try {
    await addAddressService(req.body, req.userEmail);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const getAddressByIdController = async (req, res, next) => {
  try {
    const addressId = parseInt(req.params.addressId, 10);
    const result = await getAddressByIdService(addressId, req.userEmail);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateAddressController = async (req, res, next) => {
  try {
    const addressId = parseInt(req.params.addressId);
    await updateAddressService(req.body, addressId, req.userEmail);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export default {
  getAddressController,
  addAddressController,
  getAddressByIdController,
  updateAddressController,
};
