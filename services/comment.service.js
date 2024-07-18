"use strict";

const { BadRequestError } = require("../core/error");
const User = require("../models /user.models");
const Comment = require("../models /comment.model");
const Exam = require("../models /exam.model");

class CommentService {
  static async createComment({
    commentParent,
    replyingTo,
    commentedBy,
    content,
    examId,
  }) {
    const findUser = await User.findById(commentedBy)
      .select("username profile_img")
      .lean();
    if (!findUser) throw new BadRequestError("Commenting User is not valid");
    if (!content.length)
      throw new BadRequestError("You should write something to comment");
    let commentObj = {
      content,
      commented_by: findUser._id,
      comment_exam: examId,
    };
    let newComment = {};
    if (commentParent) {
      commentObj.replying_to = replyingTo;
      commentObj.is_reply = true;
      const findParentComment = await Comment.findOne({
        _id: commentParent,
      }).select(" comment_parent comment_level");
      if (!findParentComment) throw new Error("parent comment not found");

      if (findParentComment.comment_level === 3) {
        commentObj.comment_parent = findParentComment.comment_parent;
        commentObj.comment_level = 3;
        newComment = await Comment.create(commentObj);
        const grandfatherComment = await Comment.findOneAndUpdate(
          { _id: findParentComment.comment_parent },
          { $push: { children_comment: newComment._id } }
        );
      } else {
        commentObj.comment_parent = findParentComment._id;
        commentObj.comment_level = findParentComment.comment_level + 1;
        newComment = await Comment.create(commentObj);
        const grandfatherComment = await Comment.findOneAndUpdate(
          { _id: findParentComment._id },
          { $push: { children_comment: newComment._id } }
        );
      }
    } else {
      commentObj.comment_level = 1;
      newComment = await Comment.create(commentObj);
    }
    console.log({ newComment });
    const updatedExam = await Exam.findOneAndUpdate(
      { _id: examId },
      {
        $inc: {
          exam_parent_comments: commentParent ? 0 : 1,
          exam_comments: 1,
        },
        $push: {
          comments: newComment._id,
        },
      },
      { new: true, upsert: true }
    );
    const createdComment = await Comment.findById(newComment._id)
      .populate("commented_by", "profile_img username")
      .populate("replying_to", "username")
      .select(
        "commentedAt content comment_level comment_parent children_comment"
      )
      .lean();

    return createdComment;
  }
  static async getComments({ examId, skip = 0 }) {
    const maxLimit = 5;

    const findExam = await Exam.findById(examId).lean();
    if (!findExam) {
      throw new BadRequestError("Exam id not valid");
    }
    const comments = await Comment.find({
      comment_exam: findExam._id,
      is_reply: false,
    })
      .populate("commented_by", "username profile_img")
      .select("commentedAt content comment_level children_comment")
      .skip(skip)
      .limit(maxLimit)
      .sort({ commentedAt: -1 })
      .lean();

    return comments;
  }
  static async getReplies({ commentId }) {
    const findComment = await Comment.findById(commentId).lean();

    if (!findComment) throw new BadRequestError("Comment id is not valid");
    const replies = await Comment.findOne({ _id: findComment._id }).populate({
      path: "children_comment",

      populate: {
        path: "commented_by replying_to",
        select: "profile_img username",
      },
      select: "-comment_exam -is_reply",
    });
    return replies.children_comment;
  }
}

module.exports = CommentService;
