const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
require("dotenv").config();
const { mailSender } = require("../utils/mailSender");
const passwordUpdateTemplate = require("../mail/templates/passwordUpdate");

// send otp
exports.sendOtp = async (req, res) => {
  try {
    // Take email from req body
    const { email } = req.body;
    //  check if user exists or not
    // if yes, send res false
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      res.status(401).json({
        success: false,
        message: "User already exists.",
      });
    }

    // if no, generate OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // make sure otp is unique

    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    }

    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);

    // send response
    res.status(201).json({
      success: true,
      message:
        "Your otp has been generated successfull and has been sent to your gmail.",
      secureData: {
        o_t_p: {
          otp: otpBody,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Some error occurred while generating OTP. Please try again!",
    });
  }
};

// Signup

exports.signUp = async (req, res) => {
  try {
    // data fetch from body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validate data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // check password and confirmpassword
    if (password !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "Both passwords should be same. Please re-check both of them.",
      });
    }

    // check if user already exists or not
    const checkUser = await User.findOne({ email: email });
    if (checkUser) {
      res.status(400).json({
        success: false,
        message: "User is already registered.",
      });
    }

    // find most recent otp for user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    // validate otp
    if (recentOtp.length == 0) {
      // Otp not found
      return res.status(400).json({
        success: false,
        message: "OTP not found.",
      });
    } else if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "OTP doesn't match. Please try again!",
      });
    }

    // hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // db entry
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPass,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
        firstName
      )}%20${encodeURIComponent(lastName)}`,
    });

    // return success response
    res.status(201).json({
      success: true,
      message: "User is signed up successfully.",
      userData: {
        user: {
          data: user,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occurred while signing up. Please try again!",
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(402).json({
        success: false,
        message: "All fileds are mandatory.",
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exists. Please register first.",
      });
    }

    const payload = {
      email: existingUser.email,
      id: existingUser._id,
      accountType: existingUser.accountType,
    };

    if (await bcrypt.compare(password, existingUser.password)) {
      // password matched
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      const user = existingUser.toObject();
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res
        .status(201)
        .cookie("authToken", token, options)
        .json({
          success: true,
          message: "User logged in successfully.",
          loggedUser: {
            dataUser: {
              data: user,
            },
          },
        });
    } else {
      // password doesn't match
      return res.status(401).json({
        success: false,
        message: "Password is incorrect. Please re-type the correct password.",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Some error occurred while login. Please try again.",
    });
  }
};

// change password

exports.changePassword = async (req, res) => {
  try {
    // Get data from req body
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

    // Find the existing user
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "No user present with this email.",
      });
    }

    // Validate old password
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      existingUser.password
    );
    if (!isOldPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect.",
      });
    }

    // Check if new password matches the old password
    const isSameAsOldPassword = await bcrypt.compare(
      newPassword,
      existingUser.password
    );
    if (isSameAsOldPassword) {
      return res.status(401).json({
        success: false,
        message: "This password has already been used. Try another one.",
      });
    }

    // Check if new password matches confirmation password
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Both passwords should match. Please re-check both fields.",
      });
    }

    // Hash the new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.updateOne(
      { email }, // Find the user by email
      { $set: { password: newHashedPassword } } // Only update the password
    );

    // Send email notification
    try {
      await mailSender(
        email,
        "Password Updated - Learn Sphere",
        passwordUpdateTemplate(existingUser.firstName, existingUser.email)
      );
    } catch (mailError) {
      console.error("Failed to send email notification:", mailError.message);
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Password has been updated.",
    });
  } catch (error) {
    console.error("Error while updating password:", error.message);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating the password. Please try again.",
    });
  }
};
