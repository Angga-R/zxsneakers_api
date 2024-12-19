import { getAddressService } from "../services/address-service.js";

const getAddressController = async (req, res, next) => {
  try {
    const result = await getAddressService(req.userEmail);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default { getAddressController };
