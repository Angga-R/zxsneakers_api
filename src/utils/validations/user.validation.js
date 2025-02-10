import Joi from "joi";

const updatePassword = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(7).max(100).required(),
  confirmPassword: Joi.string().required(),
});

const updateName = Joi.string().min(3).max(20).required();

export default { updateName, updatePassword };
