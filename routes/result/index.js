"use strict";

const express = require("express");
const resultController = require("../../controllers/result.controller");

const asyncHandler = require("../../helps/asyncHandler");
const {
  authentication,
} = require("../../middlewares/authentication.middleware");
const router = express.Router();

router.get("/:id", asyncHandler(resultController.getResultById));
router.post("/", authentication, asyncHandler(resultController.getResulByUser));

module.exports = router;
