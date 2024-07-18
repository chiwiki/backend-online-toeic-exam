const mongoose = require("mongoose"); // Erase if already required
const { Schema } = require("mongoose");
const DOCUMENT_NAME = "Exam";
const COLLECTION = "exam";
// Declare the Schema of the Mongo model
var examSchema = new mongoose.Schema(
  {
    exam_name: {
      type: String,
      required: true,
    },
    exam_parts: {
      type: Number,
      required: true,
    },
    exam_time: {
      type: Number,
      require: true,
    },
    exam_description: {
      type: String,
    },
    exam_questions: {
      type: Number,
    },
    exam_tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    exam_number_user_test: {
      type: Number,
      default: 0,
    },
    exam_comments: {
      type: Number,
    },
    exam_parent_comments: {
      type: Number,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, examSchema);
