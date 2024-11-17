import Joi from "joi";

const registerValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  name: Joi.string().min(3).max(20).required(),
  password: Joi.string().min(7).max(100).required(),
});

export { registerValidation };
