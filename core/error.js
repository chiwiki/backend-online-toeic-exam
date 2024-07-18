const reasonPhrases = require("../utils/reasonPhrases");
const statusCodes = require("../utils/statusCodes");

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class AuthError extends ErrorResponse {
  constructor(message, statusCode) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = reasonPhrases.BAD_REQUEST,
    statusCode = statusCodes.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = reasonPhrases.NOT_FOUND,
    statusCode = statusCodes.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ErrorResponse,
  BadRequestError,
  NotFoundError,
  AuthError,
};
