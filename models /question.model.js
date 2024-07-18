const mongoose = require("mongoose"); // Erase if already required
const { Schema } = require("mongoose");

const DOCUMENT_NAME = "Question";
const COLLECTION_NAME = "Questions";
// Declare the Schema of the Mongo model
var questionSchema = new mongoose.Schema(
  {
    question_content: {
      type: String,
    },
    question_content: {
      type: String,
    },
    question_images: {
      type: Array,
    },
    question_audio: {
      type: String,
    },

    question_transcript: {
      type: String,
    },
    question_list: [
      { type: Schema.Types.ObjectId, required: true, ref: "SingleQuestion" },
    ],
    question_part: {
      type: Schema.Types.ObjectId,
      ref: "Part",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const singleQuestionSchema = new Schema({
  question_parent: {
    type: Schema.Types.ObjectId,
    ref: DOCUMENT_NAME,
  },
  type: {
    type: String,
    enum: ["Type answer", "Choice answer"],
  },
  content: {
    type: String,
  },
  choices: {
    type: Array,
    default: [],
  },
  answer: {
    type: String,
  },
  explaination: {
    type: String,
  },
  index: {
    type: Number,
  },
  question_tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
});
//Export the model
module.exports = {
  question: mongoose.model(DOCUMENT_NAME, questionSchema),
  sQuestion: mongoose.model("SingleQuestion", singleQuestionSchema),
};
