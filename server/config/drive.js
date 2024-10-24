const { google } = require("googleapis");
require("dotenv").config();

let jwtClient; // Declare a variable to hold the jwtClient

exports.connectDrive = async () => {
  try {
    jwtClient = new google.auth.JWT(
      process.env.CLIENT_MAIL,
      null,
      process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
      [process.env.SCOPE] // Ensure SCOPE is an array
    );
    await jwtClient.authorize();
    console.log("Drive API connected successfully ...");
  } catch (error) {
    console.log("Error while connecting to Google Drive ...", error);
  }
};

exports.getAuthClient = () => {
  return jwtClient; // Export the jwtClient
};
