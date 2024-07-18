"use strict";

const { uploadDisk } = require("../../configs/multer.config");
const uploadController = require("../../controllers/upload.controller");
const asyncHandler = require("../../helps/asyncHandler");

const express = require("express");
const router = express.Router();

router.post(
  "/image",
  uploadDisk.array("question_file"),
  asyncHandler(uploadController.uploadImages)
);
router.post(
  "/audio",
  uploadDisk.single("question_file"),
  asyncHandler(uploadController.uploadAudio)
);
module.exports = router;
