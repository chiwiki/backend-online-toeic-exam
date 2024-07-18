"use strict";

const express = require("express");
const examController = require("../../controllers/exam.controller");
const asyncHandler = require("../../helps/asyncHandler");
const router = express.Router();
router.get("/:examId", asyncHandler(examController.getExam));
router.post("/all", asyncHandler(examController.getAllExams));
router.post("", asyncHandler(examController.createNewExam));

module.exports = router;
