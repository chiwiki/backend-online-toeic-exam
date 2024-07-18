"use strict";
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "shopdevchinguyen",
  api_key: "352295752622332",
  api_secret: process.env.CLOUDINARY_SECRET_API,
});

module.exports = cloudinary;
