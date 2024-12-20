import Joi from "joi";

const addAddressValidation = Joi.object({
  no_telp: Joi.string().min(9).max(20).required(),
  postal_code: Joi.string().max(11).required(),
  street: Joi.string().max(100).required(),
  sub_distric: Joi.string().max(100).required(),
  city: Joi.string().max(100).required(),
  province: Joi.string().max(100).required(),
  country: Joi.string().max(100).required(),
});

export { addAddressValidation };
