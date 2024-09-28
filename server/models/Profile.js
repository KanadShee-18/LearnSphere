const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  displayName: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  about: {
    type: String,
    trim: true,
  },
  profession: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
