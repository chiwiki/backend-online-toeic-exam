"use strict";

const { AuthError, NotFoundError, BadRequestError } = require("../core/error");

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models /user.models");
const { createTokenPairs } = require("../auth/authUtils");
const Key = require("../models /keyToken.model");
const { getInfoData, removeVietnameseTones } = require("../utils");
const { getAuth } = require("firebase-admin/auth");
const KeyTokenService = require("./keyToken.service");

class UserService {
  static async register(payload) {
    const { email, password } = payload;
    const existUser = await User.findOne({
      email,
    });
    if (existUser) {
      throw new AuthError("this email was used to register");
    } else {
      const { publicKey, privateKey } = await crypto.generateKeyPairSync(
        "rsa",
        {
          modulusLength: 4096, // Key size in bits
          publicKeyEncoding: {
            type: "pkcs1", // Recommended to be 'spki' by Node.js
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8", // Recommended to be 'pkcs8' by Node.js
            format: "pem",
          },
        }
      );
      const hashedPassword = await bcrypt.hash(password, 10);
      const username = email.split("@")[0];
      const newUser = await User.create({
        email,
        username,
        password: hashedPassword,
      });
      console.log("USER::", newUser);
      const { accessToken, refreshToken } = await createTokenPairs(
        { userId: newUser._id, email },
        privateKey
      );
      console.log("ACCESS TOKEN", accessToken);
      const newKeyStore = await KeyTokenService.createNewKeyToken({
        userId: newUser._id,
        publicKey,
        refreshToken,
      });
      console.log("KEY STORE::", newKeyStore);
      return {
        shop: getInfoData({
          fields: ["_id", "username", "email", "profile_img", "role"],
          object: newUser,
        }),
        token: accessToken,
      };
      // console.log({ publicKey, privateKey });
    }
  }
  static async login(payload) {
    const { email, password } = payload;
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      throw new NotFoundError("User not exist");
    }
    const { publicKey, privateKey } = await crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096, // Key size in bits
      publicKeyEncoding: {
        type: "pkcs1", // Recommended to be 'spki' by Node.js
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8", // Recommended to be 'pkcs8' by Node.js
        format: "pem",
      },
    });
    const matchPassword = await bcrypt.compare(password, foundUser.password);
    if (!matchPassword) {
      throw new AuthError("password not match ");
    }
    const { accessToken, refreshToken } = await createTokenPairs(
      { userId: foundUser._id, email },
      privateKey
    );
    console.log("ACCESS TOKEN", accessToken);
    const newKeyStore = await KeyTokenService.createNewKeyToken({
      userId: foundUser._id,
      publicKey,
      refreshToken,
    });
    console.log("KEY STORE::", newKeyStore);
    return {
      shop: getInfoData({
        fields: ["_id", "username", "email", "profile_img", "role"],
        object: foundUser,
      }),
      token: accessToken,
    };
  }
  static async loginWithGoogle({ access_token }) {
    const { publicKey, privateKey } = await crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096, // Key size in bits
      publicKeyEncoding: {
        type: "pkcs1", // Recommended to be 'spki' by Node.js
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8", // Recommended to be 'pkcs8' by Node.js
        format: "pem",
      },
    });
    const result = getAuth()
      .verifyIdToken(access_token)
      .then(async (decodedUser) => {
        console.log("decodedUser: ", decodedUser);
        let { email, name, picture } = decodedUser;
        picture = picture.replace("s96-c", "s384-c");
        console.log(email, name, picture);

        let user = await User.findOne({ email: email });
        if (user) {
          if (!user.google_auth) {
            throw new BadRequestError(
              "Email này đã được đăng ký. Vui lòng quay lại nhập email và mật khẩu để đăng nhập"
            );
          } else {
            const { accessToken, refreshToken } = await createTokenPairs(
              { userId: user._id, email },
              privateKey
            );
            console.log("ACCESS TOKEN", accessToken);
            const newKeyStore = await KeyTokenService.createNewKeyToken({
              userId: user._id,
              publicKey,
              refreshToken,
            });
            return {
              shop: getInfoData({
                fields: [
                  "_id",
                  "username",
                  "email",
                  "fullname",
                  "profile_img",
                  "role",
                ],
                object: user,
              }),
              token: accessToken,
            };
          }
        } else {
          const username = email.split("@")[0];
          const newUser = await User.create({
            email,
            fullname: name,
            username,
            profile_img: picture,

            google_auth: true,
          });
          const { accessToken, refreshToken } = await createTokenPairs(
            { userId: newUser._id, email },
            privateKey
          );
          console.log("ACCESS TOKEN", accessToken);
          const newKeyStore = await KeyTokenService.createNewKeyToken({
            userId: newUser._id,
            publicKey,
            refreshToken,
          });
          return {
            shop: getInfoData({
              fields: [
                "_id",
                "username",
                "email",
                "fullname",
                "profile_img",
                "role",
              ],
              object: newUser,
            }),
            token: accessToken,
          };
        }
      })
      .catch((err) => {
        throw err;
      });
    return result;
  }
  static async loginWithFacebook({ access_token }) {
    const { publicKey, privateKey } = await crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096, // Key size in bits
      publicKeyEncoding: {
        type: "pkcs1", // Recommended to be 'spki' by Node.js
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8", // Recommended to be 'pkcs8' by Node.js
        format: "pem",
      },
    });
    const result = await getAuth()
      .verifyIdToken(access_token)
      .then(async (decodedUser) => {
        console.log("decodedUser: ", decodedUser);
        const { name, picture } = decodedUser;
        const username = removeVietnameseTones(name).replaceAll(" ", "_");
        const findUser = await User.findOne({ username });
        if (findUser) {
          if (!findUser.facebook_auth) {
            throw new BadRequestError("Please try anathor method");
          } else {
            const { accessToken, refreshToken } = await createTokenPairs(
              { userId: findUser._id },
              privateKey
            );

            const newKeyStore = await KeyTokenService.createNewKeyToken({
              userId: findUser._id,
              publicKey,
              refreshToken,
            });
            return {
              shop: getInfoData({
                fields: ["_id", "username", "fullname", "profile_img", "role"],
                object: findUser,
              }),
              token: accessToken,
            };
          }
        } else {
          const newUser = await User.create({
            fullname: name,
            username,
            profile_img: picture,
            facebook_auth: true,
          });
          const { accessToken, refreshToken } = await createTokenPairs(
            { userId: newUser._id },
            privateKey
          );

          const newKeyStore = await KeyTokenService.createNewKeyToken({
            userId: newUser._id,
            publicKey,
            refreshToken,
          });
          return {
            shop: getInfoData({
              fields: ["_id", "username", "fullname", "profile_img", "role"],
              object: newUser,
            }),
            token: accessToken,
          };
        }
      })
      .catch((err) => {
        throw err;
      });

    return result;
  }
}

module.exports = UserService;
