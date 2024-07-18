"use strict";

const express = require("express");
const testController = require("../../controllers/test.controller");

const asyncHandler = require("../../helps/asyncHandler");
const {
  authentication,
} = require("../../middlewares/authentication.middleware");
const router = express.Router();

router.post("/checkout", asyncHandler(testController.checkout));
router.post("/submit", authentication, asyncHandler(testController.submitExam));
router.post("", authentication, asyncHandler(testController.testExam));

module.exports = router;
