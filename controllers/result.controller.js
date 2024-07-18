const SuccessResponse = require("../core/success");
const ResultService = require("../services/result.service");

class ResultController {
  getResultById = async (req, res, next) => {
    const { id } = req.params;
    new SuccessResponse({
      message: "get result by id",
      metaData: await ResultService.getResultById({ id }),
    }).send(res);
  };
  getResulByUser = async (req, res, next) => {
    const { userId } = req.user;
    new SuccessResponse({
      message: "get result by id",
      metaData: await ResultService.getResultByUser({
        userId,
        ...req.body,
      }),
    }).send(res);
  };
}
module.exports = new ResultController();
