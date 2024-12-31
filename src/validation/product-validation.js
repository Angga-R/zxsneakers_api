import Joi from "joi";

const addProductValidation = Joi.object({
  name: Joi.string().max(100).required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  colors: Joi.array().items(Joi.string().max(20).required()).max(5).required(),
  sizes: Joi.array().items(Joi.number().max(50).required()).max(5).required(),
});

export { addProductValidation };
