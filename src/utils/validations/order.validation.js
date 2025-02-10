import Joi from "joi";

const create = Joi.object({
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

export default { create };
