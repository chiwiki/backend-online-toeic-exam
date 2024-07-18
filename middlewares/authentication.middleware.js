"use strict";
const jwt = require("jsonwebtoken");
const { BadRequestError, AuthError } = require("../core/error");
const asyncHandler = require("../helps/asyncHandler");
const Key = require("../models /keyToken.model");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHRIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFRESHTOKEN: "refresh-token",
};
const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new BadRequestError("missing client id");
  const keyToken = await Key.findOne({ user: userId });
  if (!keyToken) throw new BadRequestError("User not exist in system");
  const accessToken = req.headers[HEADER.AUTHRIZATION];
  if (!accessToken) throw new BadRequestError("missing access token");
  try {
    const decodedUser = jwt.verify(accessToken, keyToken.publicKey.toString());
    console.log("DECODED USER::", decodedUser);
    if (decodedUser.userId !== userId) throw new AuthError("invalid request");
    req.user = decodedUser;
    req.keyStore = keyToken;
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  authentication,
};
