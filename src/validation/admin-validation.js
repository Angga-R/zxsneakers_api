import Joi from "joi";

export const updatePasswordAdminValidation = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(7).max(100).required(),
  confirmPassword: Joi.string().required(),
});
