"use strict";

const express = require("express");
const tagController = require("../../controllers/tag.controller");
const asyncHandler = require("../../helps/asyncHandler");
const router = express.Router();

router.get("", asyncHandler(tagController.getAllTags));
router.get("/search", asyncHandler(tagController.searchTag));
router.post("", asyncHandler(tagController.createNewTag));
module.exports = router;
