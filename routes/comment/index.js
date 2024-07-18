"use strict";

const express = require("express");
const commentController = require("../../controllers/comment.controller");

const asyncHandler = require("../../helps/asyncHandler");
const {
  authentication,
} = require("../../middlewares/authentication.middleware");
const router = express.Router();

router.get("/replies/:commentId", asyncHandler(commentController.getReplies));
router.post(
  "/create",
  authentication,
  asyncHandler(commentController.createNewComment)
);
router.post(
  "",

  asyncHandler(commentController.getComments)
);

module.exports = router;
