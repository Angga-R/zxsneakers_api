import Joi from "joi";

const updatePasswordValidation = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(7).max(100).required(),
  confirmPassword: Joi.string().required(),
});

const updateNameValidation = Joi.string().min(3).max(20).required();

export { updatePasswordValidation, updateNameValidation };
