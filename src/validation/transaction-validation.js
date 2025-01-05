import Joi from "joi";

export const createTransactionValidation = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        sku: Joi.string().required(),
        color: Joi.string().required(),
        size: Joi.number().required(),
        quantity: Joi.number().required(),
      }).required()
    )
    .required(),
});
