import {
  addAddressService,
  getAddressService,
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

export default { getAddressController, addAddressController };
