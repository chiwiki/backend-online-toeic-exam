"use strict";

const SuccessResponse = require("../core/success");
const CommentService = require("../services/comment.service");

class CommentController {
  createNewComment = async (req, res, next) => {
    const { userId: commentedBy } = req.user;
    new SuccessResponse({
      message: "create new comment",
      metaData: await CommentService.createComment({
        commentedBy,
        ...req.body,
      }),
    }).send(res);
  };
  getComments = async (req, res, next) => {
    new SuccessResponse({
      message: "get comments",
      metaData: await CommentService.getComments(req.body),
    }).send(res);
  };
  getReplies = async (req, res, next) => {
    new SuccessResponse({
      message: "get replies successfully!!!",
      metaData: await CommentService.getReplies(req.params),
    }).send(res);
  };
}
module.exports = new CommentController();
