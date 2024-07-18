const SuccessResponse = require("../core/success");
const TestService = require("../services/test.service");

class TestController {
  checkout = async (req, res, next) => {
    new SuccessResponse({
      message: "checkout question",
      metaData: await TestService.checkout(req.body),
    }).send(res);
  };
  testExam = async (req, res, next) => {
    console.log("QUERY", req.query);
    new SuccessResponse({
      message: "start to test",
      metaData: await TestService.test({
        ...req.body,
        ...req.query,
        decodedUser: req.user,
      }),
    }).send(res);
  };

  submitExam = async (req, res, next) => {
    new SuccessResponse({
      message: "submit test",
      metaData: await TestService.submitTest({
        ...req.body,
        ...req.query,
        decodedUser: req.user,
      }),
    }).send(res);
  };
}
module.exports = new TestController();
