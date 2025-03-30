import { AddressRepository } from "../repositories/address.repository.js";
import { ResponseError } from "../utils/error_handler/response.error.js";
import addressValidation from "../utils/validations/address.validation.js";
import { validate } from "../utils/validations/validate.js";

class AddressService {
  #address = new AddressRepository();

  async add(request, email) {
    const validatedData = validate(addressValidation.add, request);

    await this.#address.add(email, validatedData);
  }

  async getAll(email) {
    const addresses = await this.#address.findByEmail(email);

    if (addresses.length < 1) {
      throw new ResponseError(404, "address is empty");
    }

    const data = {
      data: addresses,
      totalItem: addresses.length,
    };

    return data;
  }

  async getAddressById(addressId, email) {
    const address = await this.#address.findById(addressId, email, false);

    if (!address) {
      throw new ResponseError(404, "data not found");
    }

    return address;
  }

  async update(request, addressId, email) {
    const validatedData = validate(addressValidation.update, request);

    const data = {};
    for (const key in validatedData) {
      validatedData[key] ? (data[key] = validatedData[key]) : "";
    }

    await this.#address.update(addressId, email, data);
  }

  async delete(addressId, email) {
    await this.#address.delete(addressId, email);
  }
}

export default new AddressService();
