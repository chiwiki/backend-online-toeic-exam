"use strict";

const express = require("express");
const SuccessResponse = require("../core/success");
const router = express.Router();

// router.get("/", (req, res, next) => {
//   new SuccessResponse({
//     metaData: "hlll",
//   }).send(res);
// });
router.use("/api/v1/comments", require("./comment"));
router.use("/api/v1/results", require("./result"));

router.use("/api/v1/users", require("./user"));
router.use("/api/v1/tags", require("./tag"));
router.use("/api/v1/exams", require("./exam"));
router.use("/api/v1/test", require("./test"));
router.use("/api/v1/upload", require("./upload"));
module.exports = router;
