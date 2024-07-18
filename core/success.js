const reasonPhrases = require("../utils/reasonPhrases");
const statusCodes = require("../utils/statusCodes");

class SuccessResponse {
  constructor({
    message = reasonPhrases.OK,
    statusCode = statusCodes.OK,
    metaData = {},
  }) {
    this.message = message;
    this.statusCode = statusCode;
    this.metaData = metaData;
  }
  send(res, headers = {}) {
    res.status(this.statusCode).json(this);
  }
}
class Created extends SuccessResponse {
  constructor({
    message = reasonPhrases.CREATED,
    statusCode = statusCodes.CREATED,
    metaData = {},
  }) {
    super(message, statusCode, metaData);
  }
}
module.exports = SuccessResponse;
