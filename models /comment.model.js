const mongoose = require("mongoose"); // Erase if already required
const { Schema } = require("mongoose");
const DOCUMENT_NAME = "Comment";
const COLLECTION = "Comments";

var commentSchema = new mongoose.Schema(
  {
    comment_parent: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    content: {
      type: String,
    },
    commented_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    children_comment: [
      {
        type: Schema.Types.ObjectId,
        ref: DOCUMENT_NAME,
      },
    ],
    comment_exam: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
    },
    comment_level: {
      type: Number,
      required: true,
    },
    replying_to: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    is_reply: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "commentedAt",
    },
    collection: COLLECTION,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, commentSchema);
