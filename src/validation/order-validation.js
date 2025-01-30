import Joi from "joi";

export const createOrderValidation = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().required(),
        quantity: Joi.number().required(),
      }).required()
    )
    .required(),
  addressId: Joi.number().required(),
  finishUrl: Joi.string().required(),
});
