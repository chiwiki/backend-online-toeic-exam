"use strict";

const mongoose = require("mongoose");

class Database {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(process.env.DB_URL)
      .then(() => {
        console.log("Connect to mongodb successfully!");
      })
      .catch((err) => {
        console.log("ERROR: ", err.message);
      });
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
