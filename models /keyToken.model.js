"use strict";
const mongoose = require("mongoose"); // Erase if already required
const { Schema } = require("mongoose");

const COLLECTION_NAME = "Keys";
const DOCUMENT_NAME = "Key";
// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshTokenUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      require: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamp: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
