const express = require("express");
const morgan = require("morgan");
const app = express();
const helmet = require("helmet");
const conpression = require("compression");
const { NotFoundError } = require("./core/error");
const cors = require("cors");
const firebaseAccountService = require("./configs/firebase.config");
require("dotenv").config();
//init middleware

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(conpression());

//init db
require("./dbs/init.mongo");
firebaseAccountService();
//init routes

app.use("", require("./routes"));

//handling error

app.use((req, res, next) => {
  const error = new NotFoundError();
  next(error);
});
app.use((error, req, res, next) => {
  console.log("ERROR::", error);
  const statusCode = error.statusCode ? error.statusCode : 500;
  console.log("STATUS CODE::", statusCode);
  return res.status(statusCode).json({
    message: error.message ? error.message : "Internal error",
    statusCode: statusCode,
  });
});

module.exports = app;
