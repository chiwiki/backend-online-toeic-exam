const jwt = require("jsonwebtoken");
const HEADER = {
  API_KEY: "x-api-key",
  AUTHRIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFRESHTOKEN: "refresh-token",
};
const createTokenPairs = async (payload, privateKey) => {
  const accessToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "2 days",
  });

  const refreshToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7 days",
  });
  return { accessToken, refreshToken };
};

module.exports = {
  createTokenPairs,
};
