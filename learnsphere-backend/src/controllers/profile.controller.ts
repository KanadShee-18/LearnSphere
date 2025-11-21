import type { NextFunction, Response } from "express";
import { Course, type ICourse } from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";
import { Profile } from "../models/profile.model.js";
import type { ISection } from "../models/section.model.js";
import { type ISubSection } from "../models/subSection.model.js";
import { User, type IUser } from "../models/user.model.js";
import type { AuthRequest } from "../types/extend-auth.js";
import {
  destroyImageFromCloudinary,
  uploadImageToCloudinary,
} from "../utils/imageUploader.js";
import { convertSecondsToDuration } from "../utils/secToDuration.js";
import logger from "../configs/logger.js";
import { NotFoundError } from "../utils/error-handler.js";

// Update Profile
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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
    const id = req.auth?.authUser?.id;

    // Find the profile by id
    const userDetails = await User.findById(id);

    if (!userDetails) {
      return next(new NotFoundError("User not found."));
    }

    const profile = await Profile.findById(userDetails.additionalDetails);

    if (!profile) {
      return next(new NotFoundError("User profile not available!"));
    }

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

    res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
    return;
  } catch (error) {
    logger.error("Error in updating user profile: ", error);
    return next(error);
  }
};

// Delete Account:

export const deleteProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth?.authUser?.id;
    // const userId = req.body.userId;
    // validate id:
    const findUser = await User.findById(userId);
    if (!findUser) {
      return next(new NotFoundError("User not found."));
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
    logger.info("Deleted User", deletedUser);

    // Return Success Response
    res.status(200).json({
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
    return;
  } catch (error) {
    logger.error("Error in deleting profile: ", error);
    return next(error);
  }
};

// Get a particular user all details

export const getUserAllDetails = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // get id
    // const userId = req.user.id || req.headers.userid;
    const userId = req.headers.userid;

    //validate
    const userDetails = await User.findById(userId)
      .populate("additionalDetails")
      .populate("courses");
    if (!userDetails) {
      return next(new NotFoundError("User not found."));
    }
    res.status(200).json({
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
    return;
  } catch (error) {
    logger.error("Error in getting user all details: ", error);
    return next(error);
  }
};

// Update Display Picture:
export const updateDisplayPicture = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const displayPicture = req.images;

    const userId = req.auth?.authUser?.id;

    const user = await User.findById(userId);

    if (!user) {
      return next(new NotFoundError("User not found."));
    }

    const oldImgUrl = user.image;

    const publicId = oldImgUrl.split("/").slice(-2).join("/").split(".")[0];
    console.log("The public id is: ", publicId);

    // Destroying old image
    if (publicId) {
      const deletedImg = await destroyImageFromCloudinary(publicId);
      logger.info(deletedImg);
    }

    // Uploading new image.

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.CLOUDINARY_FOLDER_NAME as string,
      1000,
      70
    );
    logger.info("Uploaded image details: ", image);

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
    logger.error("Error in updating display picture: ", error);

    return next(error);
  }
};

export const getEnrolledCourses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth?.authUser?.id;
    const userDoc = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    if (!userDoc) {
      return next(new NotFoundError("User not found."));
    }

    const userDetails = userDoc.toObject() as unknown as IUser & {
      courses: (ICourse & {
        totalDuration?: string;
        progressPercentage?: number;
        courseContent: (ISection & {
          subSection: ISubSection[];
        })[];
      })[];
    };

    for (const course of userDetails.courses) {
      let totalDurationInSeconds = 0;
      let SubsectionLength = 0;

      for (const content of course.courseContent) {
        totalDurationInSeconds += content.subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        SubsectionLength += content.subSection.length;
      }

      course.totalDuration = convertSecondsToDuration(totalDurationInSeconds);

      const courseProgressDoc = await CourseProgress.findOne({
        courseID: course._id,
        userId,
      });

      const completedCount = courseProgressDoc?.completedVideos.length ?? 0;

      course.progressPercentage =
        SubsectionLength === 0
          ? 100
          : Math.round((completedCount / SubsectionLength) * 100 * 100) / 100;
    }
    res.status(200).json({
      success: true,
      courses: {
        data: userDetails.courses,
      },
    });
    return;
  } catch (error) {
    logger.error("Error in getting enrolled courses: ", error);
    return next(error);
  }
};

export const instructorDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseDetails = await Course.find({
      instructor: req.auth?.authUser?.id,
    });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * (course.price ?? 0);

      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      };
      return courseDataWithStats;
    });
    res.status(200).json({
      success: true,
      message: "Stats details fetched successfully.",
      courses: courseData,
    });
  } catch (error) {
    logger.error("Error in getting instructor dashboard: ", error);
    return next(error);
  }
};
