import Joi from "joi";

export const createOrderValidation = Joi.object({
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
  addressId: Joi.number().required(),
  finishUrl: Joi.string().required(),
});
