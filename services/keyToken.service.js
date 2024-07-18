"use strict";

const Key = require("../models /keyToken.model");

class KeyTokenService {
  static createNewKeyToken = async ({ userId, publicKey, refreshToken }) => {
    const filter = { user: userId },
      update = {
        publicKey: publicKey,
        refreshToken: refreshToken,
        refreshTokenUsed: [],
      },
      options = { new: true, upsert: true };
    const newKeyToken = await Key.findOneAndUpdate(filter, update, options);
    return newKeyToken;
  };
}
module.exports = KeyTokenService;
