const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    // Fetch data
    const { dateOfBirth = "", gender, about = "", contactNumber } = req.body;
    // Get user id from the req.user we have passed through auth middleware
    // const userId = req.user.id || req.headers.userid;
    const userId = req.headers.userid;

    // Validate
    if (!gender || !contactNumber || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    // As we don't have profile id so get the user details and from there we have to take profile id
    const userDetails = await User.findById({ _id: userId }).populate(
      "additionalDetails"
    );
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // Update profile details
    profileDetails.gender = gender;
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;

    await profileDetails.save();

    // Return response
    return res.status(200).json({
      success: true,
      message: "Profile Details have been updated successfully.",
      data: {
        details: {
          profile: [
            { profileDetails: profileDetails },
            { userDetails: userDetails },
          ],
        },
      },
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
    // get the id:
    // const userId = req.user.id;
    const userId = req.body.userId;
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
    // Return Success Response
    return res.status(200).json({
      success: false,
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
    const displayPicture = req.files.displayPicture;
    // const userId = req.user.id || req.files.id;
    const userId = req.headers.userid;

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.CLOUDINARY_FOLDER_NAME,
      1000,
      70
    );

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
    // const userId = req.user.id;
    const userId = req.headers.userid;
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
