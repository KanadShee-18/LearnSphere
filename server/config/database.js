const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("DB connected successfully...");
    })
    .catch((err) => {
      console.log("Some error occurred while connected to db.");
      console.log(err);
      process.exit(1);
    });
};
