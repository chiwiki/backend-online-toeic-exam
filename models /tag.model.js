const mongoose = require("mongoose"); // Erase if already required
const { Schema } = require("mongoose");

const DOCUMENT_NAME = "Tag";
const COLLECTION_NAME = "Tags";
// Declare the Schema of the Mongo model
var tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tag_children: [{ type: Schema.Types.ObjectId, ref: DOCUMENT_NAME }],
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    parent_tag_id: {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, tagSchema);
