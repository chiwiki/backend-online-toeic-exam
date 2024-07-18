const SuccessResponse = require("../core/success");
const UserService = require("../services/user.service");

class UserController {
  regiter = async (req, res, next) => {
    new SuccessResponse({
      message: "create user successfully!!!",
      metaData: await UserService.register(req.body),
    }).send(res);
  };
  login = async (req, res, next) => {
    new SuccessResponse({
      message: "login successfully!",
      metaData: await UserService.login(req.body),
    }).send(res);
  };
  loginWithGoogle = async (req, res, next) => {
    new SuccessResponse({
      message: "Login with google",
      metaData: await UserService.loginWithGoogle(req.body),
    }).send(res);
  };
  loginWithFacebook = async (req, res, next) => {
    new SuccessResponse({
      message: "Login with google",
      metaData: await UserService.loginWithFacebook(req.body),
    }).send(res);
  };
}

module.exports = new UserController();
