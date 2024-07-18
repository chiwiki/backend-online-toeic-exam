"use strict";

const SuccessResponse = require("../core/success");
const TagService = require("../services/tag.service");

class TagController {
  createNewTag = async (req, res, next) => {
    new SuccessResponse({
      message: "create new tag ",
      metaData: await TagService.createNewTag(req.body),
    }).send(res);
  };
  getAllTags = async (req, res, next) => {
    new SuccessResponse({
      message: "get all parent tags",
      metaData: await TagService.getAllTags(),
    }).send(res);
  };
  searchTag = async (req, res, next) => {
    new SuccessResponse({
      message: "search tag successfully",
      metaData: await TagService.searchTag(req.query),
    }).send(res);
  };
}
module.exports = new TagController();
