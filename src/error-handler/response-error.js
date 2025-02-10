export class ResponseError extends Error {
  constructor(status, messages, fields) {
    const errorObject = {};
    if (fields && fields[0] !== undefined) {
      if (Array.isArray(fields) === false) {
        errorObject[fields] = messages;
      } else {
        for (let i = 0; i < fields.length; i++) {
          errorObject[fields[i]] = messages[i];
        }
      }
      super(JSON.stringify(errorObject));
    } else {
      super(messages);
    }
    this.status = status;
  }
}
