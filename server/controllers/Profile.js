const Profile = require("../models/Profile");
const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course");
const {
  uploadImageToCloudinary,
  destroyImageFromCloudinary,
} = require("../utils/imageUploader");
require("dotenv").config();

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    // Fetch data
    const {
      dateOfBirth = "",
      gender,
      about = "",
      contactNumber,
      profession = "",
      displayName = "",
    } = req.body;
    // Get user id from the req.user we have passed through auth middleware
    const id = req.user.id;

    // Find the profile by id
    const userDetails = await User.findById(id);
    const profile = await Profile.findById(userDetails.additionalDetails);

    // Update the profile fields
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;
    profile.profession = profession;
    profile.displayName = displayName;

    // Save the updated profile
    await profile.save();

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Some error occurred while updating the profile details. Please try again.",
    });
  }
};

// Delete Account:

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    // const userId = req.body.userId;
    // validate id:
    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }
    // Now delete the profile associated with the user
    const deletedProfile = await Profile.findByIdAndDelete({
      _id: findUser.additionalDetails,
    });
    // Remove the user from the enrolled courses.
    await Course.updateMany(
      { studentsEnrolled: userId }, // first search the user id in the array then remove
      {
        $pull: {
          studentsEnrolled: userId,
        },
      }
    );
    // Now delete the User
    const deletedUser = await User.findByIdAndDelete(userId);
    console.log("Deleted User", deletedUser);

    // Return Success Response
    return res.status(200).json({
      success: true,
      message: "User account has been deleted successfully.",
      account: {
        deleted: [
          {
            del_profile: deletedProfile,
          },
          {
            del_account: deletedUser,
          },
        ],
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message:
        "Some error occurred while deleting the user account. Please try again.",
    });
  }
};

// Get a particular user all details

exports.getUserAllDetails = async (req, res) => {
  try {
    // get id
    // const userId = req.user.id || req.headers.userid;
    const userId = req.headers.userid;

    //validate
    const userDetails = await User.findById(userId)
      .populate("additionalDetails")
      .populate("courses");
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Not able to fetch all details of the user.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Users data has been fetched successfully.",
      data: {
        user: {
          userData: {
            user_details: userDetails,
          },
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Some error occurred while fetching the whole user data.",
    });
  }
};

// Update Display Picture:
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.images;
    console.log(req.images);

    const userId = req.user.id;

    const user = await User.findById(userId);
    const oldImgUrl = user.image;

    const publicId = oldImgUrl.split("/").slice(-2).join("/").split(".")[0];
    console.log("The public id is: ", publicId);

    // Destroying old image
    if (publicId) {
      const deletedImg = await destroyImageFromCloudinary(publicId);
      console.log(deletedImg);
    }

    // Uploading new image.

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.CLOUDINARY_FOLDER_NAME,
      1000,
      70
    );
    console.log("Uploaded image details: ", image);

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    ).populate("additionalDetails");

    res.status(200).json({
      success: true,
      message: "Image updated successfully.",
      data: {
        profileData: updatedProfile,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Some error occurred while updating the profile picture.",
    });
  }
};

// Get enrolled courses:

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    // const userId = req.headers.userid;
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: `No user found with this id ${userId}.`,
      });
    }
    if (userDetails.courses.length === 0) {
      return res.status(200).json({
        success: true,
        message: "User hasn't enrolled in any courses.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Enrolled courses have been fetched successfully.",
      courses: {
        data: userDetails.courses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred to get enrolled courses. Please try again.",
    });
  }
};
