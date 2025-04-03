import addressService from "../services/address.service.js";

class AddressController {
  async getAll(req, res, next) {
    try {
      const result = await addressService.getAll(req.userEmail);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAddressById(req, res, next) {
    try {
      const result = await addressService.getAddressById(
        Number(req.params.addressId),
        req.userEmail
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async add(req, res, next) {
    try {
      await addressService.add(req.body, req.userEmail);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
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
  }

  async delete(req, res, next) {
    try {
      await addressService.delete(Number(req.params.addressId), req.userEmail);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}

export default new AddressController();
