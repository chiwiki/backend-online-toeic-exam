const express = require("express");
const userController = require("../../controllers/user.controller");
const asyncHandler = require("../../helps/asyncHandler");
const router = express.Router();

router.post("/register", asyncHandler(userController.regiter));
router.post("/login", asyncHandler(userController.login));
router.post("/login-with-google", asyncHandler(userController.loginWithGoogle));
router.post(
  "/login-with-facebook",
  asyncHandler(userController.loginWithFacebook)
);
module.exports = router;
