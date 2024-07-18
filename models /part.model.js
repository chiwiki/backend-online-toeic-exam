const mongoose = require("mongoose"); // Erase if already required
const { Schema } = require("mongoose");

const DOCUMENT_NAME = "Part";
const COLLECTION_NAME = "Parts";
// Declare the Schema of the Mongo model
var partSchema = new mongoose.Schema(
  {
    part_name: {
      type: String,
    },
    part_type: {
      type: String,
      enum: ["Listening", "Reading"],
    },
    part_number_of_questions: {
      type: Number,
    },
    part_exam: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, partSchema);
