import { ResponseError } from "../../error-handler/response-error.js";

export const validate = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    const fields = result.error.details.map((error) => error.context.key);
    const messages = result.error.details.map((error) =>
      error.message.replaceAll('"', "")
    );

    throw new ResponseError(400, messages, fields);
  } else {
    return result.value;
  }
};
