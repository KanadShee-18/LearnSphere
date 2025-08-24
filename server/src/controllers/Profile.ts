import { Profile } from "../models/Profile.js";
import { User, type IUser } from "../models/User.js";
import { Course, type ICourse } from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { convertSecondsToDuration } from "../utils/secToDuration.js";
import {
  uploadImageToCloudinary,
  destroyImageFromCloudinary,
} from "../utils/imageUploader.js";
import type { AuthRequest } from "../types/extend-auth.js";
import type { Response } from "express";
import type { ISection } from "../models/Section.js";
import { SubSection, type ISubSection } from "../models/SubSection.js";


// Update Profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
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
      res.status(404).json({
        success: false,
        message: "User not found!",
      });
      return;
    }

    const profile = await Profile.findById(userDetails.additionalDetails);

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "User profile not available!",
      });
      return;
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
    console.log("Error in updating user profile: ", error);
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An unknown error occurred.",
      });
    }
    return;
  }
};

// Delete Account:

export const deleteProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.authUser?.id;
    // const userId = req.body.userId;
    // validate id:
    const findUser = await User.findById(userId);
    if (!findUser) {
      res.status(400).json({
        success: false,
        message: "User not found!",
      });
      return;
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
    console.log("Error in deleting profile: ", error);
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An unknown error occurred.",
      });
    }
    return;
  }
};

// Get a particular user all details

export const getUserAllDetails = async (req: AuthRequest, res: Response) => {
  try {
    // get id
    // const userId = req.user.id || req.headers.userid;
    const userId = req.headers.userid;

    //validate
    const userDetails = await User.findById(userId)
      .populate("additionalDetails")
      .populate("courses");
    if (!userDetails) {
      res.status(400).json({
        success: false,
        message: "Not able to fetch all details of the user.",
      });
      return;
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
    console.log("Error in getting user all details: ", error);
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An unknown error occurred.",
      });
    }
    return;
  }
};

// Update Display Picture:
export const updateDisplayPicture = async (req: AuthRequest, res: Response) => {
  try {
    const displayPicture = req.images;
    console.log(req.images);

    const userId = req.auth?.authUser?.id;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found!",
      });
      return;
    }

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
      process.env.CLOUDINARY_FOLDER_NAME as string,
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
    console.log("Error in updating display picture: ", error);

    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An unknown error occurred.",
      });
    }
    return;
  }
};

export const getEnrolledCourses = async (req: AuthRequest, res: Response) => {
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
      res.status(404).json({
        success: false,
        message: "User not found!",
      });
      return;
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

    // userDetails = userDetails.toObject();
    // var SubsectionLength = 0;
    // for (var i = 0; i < userDetails.courses.length; i++) {
    //   let totalDurationInSeconds = 0;
    //   SubsectionLength = 0;
    //   for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
    //     totalDurationInSeconds += userDetails.courses[i].courseContent[
    //       j
    //     ].subSection.reduce(
    //       (acc, curr) => acc + parseInt(curr.timeDuration),
    //       0
    //     );
    //     userDetails.courses[i].totalDuration = convertSecondsToDuration(
    //       totalDurationInSeconds
    //     );
    //     SubsectionLength +=
    //       userDetails.courses[i].courseContent[j].subSection.length;
    //   }
    //   let courseProgressCount = await CourseProgress.findOne({
    //     courseID: userDetails.courses[i]._id,
    //     userId: userId,
    //   });
    //   courseProgressCount = courseProgressCount?.completedVideos.length;
    //   if (SubsectionLength === 0) {
    //     userDetails.courses[i].progressPercentage = 100;
    //   } else {
    //     // To make it up to 2 decimal point
    //     const multiplier = Math.pow(10, 2);
    //     userDetails.courses[i].progressPercentage =
    //       Math.round(
    //         (courseProgressCount / SubsectionLength) * 100 * multiplier
    //       ) / multiplier;
    //   }
    // }

    // if (!userDetails) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `Could not find user with id: ${userDetails}`,
    //   });
    // }
    res.status(200).json({
      success: true,
      courses: {
        data: userDetails.courses,
      },
    });
    return;
  } catch (error) {
    console.log("Error in getting enrolled courses: ", error);
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An unknown error occurred.",
      });
    }
    return;
  }
};

export const instructorDashboard = async (req: AuthRequest, res: Response) => {
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
    console.log("Error in getting instructor dashboard: ", error);
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An unknown error occurred.",
      });
    }
    return;
  }
};
