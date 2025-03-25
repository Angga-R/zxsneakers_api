import Joi from "joi";

const add = Joi.object({
  no_telp: Joi.string().min(9).max(20).required(),
  postal_code: Joi.string().max(11).required(),
  street: Joi.string().max(100).required(),
  sub_distric: Joi.string().max(100).required(),
  city: Joi.string().max(100).required(),
  province: Joi.string().max(100).required(),
  country: Joi.string().max(100).required(),
});

const update = Joi.object({
  no_telp: Joi.string().min(9).max(20).optional(),
  postal_code: Joi.string().max(11).optional(),
  street: Joi.string().max(100).optional(),
  sub_distric: Joi.string().max(100).optional(),
  city: Joi.string().max(100).optional(),
  province: Joi.string().max(100).optional(),
  country: Joi.string().max(100).optional(),
});

export default { add, update };
