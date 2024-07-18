const mongoose = require("mongoose"); // Erase if already required
const { Schema } = require("mongoose");
const DOCUMENT_NAME = "ExamResult";
const COLLECTION = "ExamResults";
// Declare the Schema of the Mongo model
var examSchema = new mongoose.Schema(
  {
    exam: { type: Schema.Types.ObjectId, ref: "Exam" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    exam_mode: {
      type: String,
      enum: ["Practice", "Test"],
    },
    exam_part_practice: { type: Array },
    listening_score: {
      type: Number,
    },
    reading_score: {
      type: Number,
    },
    total_listening: { type: Number },
    total_reading: { type: Number },
    correct: {
      type: Number,
      default: 0,
    },
    skip: {
      type: Number,
      default: 0,
    },
    incorrect: {
      type: Number,
      default: 0,
    },
    time: {
      type: String,
    },
    detail_result: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "testedAt",
    },
    collection: COLLECTION,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, examSchema);
