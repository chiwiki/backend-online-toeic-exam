"use strict";

const { BadRequestError } = require("../core/error");
const SuccessResponse = require("../core/success");
const {
  uploadImageFromLocal,
  uploadAudioFromLocal,
} = require("../services/upload.service");
class UploadController {
  uploadImages = async (req, res, next) => {
    if (!req.files) {
      throw new BadRequestError("missing file");
    }
    new SuccessResponse({
      message: "upload image successfully!",
      metaData: await uploadImageFromLocal({
        files: req.files,
        ...req.query,
      }),
    }).send(res);
  };
  uploadAudio = async (req, res, next) => {
    if (!req.file) {
      throw new BadRequestError("missing file");
    }
    new SuccessResponse({
      message: "upload image successfully!",
      metaData: await uploadAudioFromLocal({
        path: req.file.path,
        ...req.query,
      }),
    }).send(res);
  };
}
module.exports = new UploadController();
