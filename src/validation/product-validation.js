import Joi from "joi";

const addProductValidation = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().optional(),
  color: Joi.string().max(50).optional(),
  size: Joi.string().max(2).required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
});

const updateProductValidation = Joi.object({
  name: Joi.string().max(100).optional(),
  description: Joi.string().optional(),
  color: Joi.string().max(50).optional(),
  size: Joi.string().max(2).optional(),
  price: Joi.number().optional(),
  stock: Joi.number().optional(),
});

export { addProductValidation, updateProductValidation };
