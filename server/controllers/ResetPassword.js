const { passwordReset } = require("../mail/templates/passwordReset");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const User = require("../models/User");
const { mailSender } = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from body
    const { email } = req.body;

    // check user for this email exists or not
    const user = await User.findOne({ email: email });
    // email validation
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your email doesn't registered with us. Please re-check it.",
      });
    }
    // generate token
    const token = crypto.randomBytes(20).toString("hex");
    // update user by adding token and expire time
    const upatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    // create url
    const url = `http://localhost:5173/update-password/${token}`;
    // send mail containing the url
    await mailSender(
      email,
      "Password Reset Link",
      passwordReset(user.firstName, url)
    );
    // return response
    res.status(200).json({
      success: true,
      message: `Email sent successfully. Please check your email ${email} to continue further.`,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message:
        "Some error occurred while generating the password reset link. Please try again.",
    });
  }
};

// Reset Password:

exports.resetPassword = async (req, res) => {
  try {
    // fetch data
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password !== confirmPassword) {
      return res.json({
        successs: false,
        message: "Both passwords should be same. Please re-check them.",
      });
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    // validation for password strength
    if (!passwordRegex.test(password)) {
      return res.json({
        success: false,
        message:
          "Password must be at least 8 characters long and include at least one digit, one lowercase letter, and one uppercase letter.",
      });
    }

    // get user details using token
    const userDetails = await User.findOne({
      token: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // if no entry - token invalid or token time expires
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        messgae: "Token has been expired or invalid token.",
      });
    }
    // hash new password
    const newHashedPassword = await bcrypt.hash(password, 10);
    // update password
    const updateUserRes = await User.findOneAndUpdate(
      { token: token },
      { password: newHashedPassword },
      { new: true }
    );

    await mailSender(
      userDetails.email,
      "Update from LearnSphere",
      passwordUpdated(userDetails.email, userDetails.firstName)
    );

    // return response
    res.status(201).json({
      success: true,
      message: "Your password has been reset successfully.",
      userUpdatedData: {
        data: {
          userData: {
            data: updateUserRes,
          },
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Some error occurred while resetting the password. Please try again.",
    });
  }
};
