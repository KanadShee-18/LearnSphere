import type { AuthRequest } from "../types/extend-auth.js";
import type { NextFunction, Response } from "express";

import { Course, type ICourse } from "../models/course.model.js";
import { Category } from "../models/category.model.js";
import { Section, type ISection } from "../models/section.model.js";
import { SubSection, type ISubSection } from "../models/subSection.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";
import { User } from "../models/user.model.js";
import logger from "../configs/logger.js";

import {
  uploadImageToCloudinary,
  destroyImageFromCloudinary,
} from "../utils/imageUploader.js";

import { convertSecondsToDuration } from "../utils/secToDuration.js";
import type { UploadedFile } from "express-fileupload";
import { BadRequestError, NotFoundError } from "../utils/error-handler.js";

type CourseUpdate = Partial<
  Pick<
    ICourse,
    | "courseName"
    | "courseDescription"
    | "whatYouWillLearn"
    | "price"
    | "tag"
    | "category"
    | "status"
    | "instructions"
    | "thumbnail"
  >
>;

export interface ISectionPopulated {
  sectionName: string;
  subSection: ISubSection[];
}

export interface ICoursePopulated {
  courseName: string;
  courseDescription: string;
  instructor: any; // you can use IUser or populated type if needed
  whatYouWillLearn: string;
  courseContent: ISectionPopulated[];
  ratingAndReviews: any[];
  price?: number;
  thumbnail?: string;
  tag: string[];
  category?: any;
  studentsEnrolled: any[];
  instructions?: string[];
  status?: "Draft" | "Published";
  createdAt: Date;
}

// Create Course handler function:

export const createCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch all data
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body;

    // get thumbnail
    const thumbnail = req.files?.thumbnailImage;

    const tag = JSON.parse(_tag);
    const instructions = JSON.parse(_instructions);

    //Validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !category ||
      !instructions.length ||
      !thumbnail
    ) {
      return next(
        new BadRequestError("All fields are required to create a course.")
      );
    }

    let courseStatus = status || "Draft";

    const userId = req.auth?.authUser?.id;
    const instructorDetails = await User.findOne({
      _id: userId,
      accountType: "Instructor",
    });

    if (!instructorDetails) {
      return next(
        new NotFoundError("Instructor details not found for creating course.")
      );
    }

    const categoryDetails = await Category.findById(category);

    if (!categoryDetails) {
      return next(new NotFoundError("Category details not found."));
    }

    // After all validation, upload image to cloudinary
    const thumbnailImageUploaded = await uploadImageToCloudinary(
      thumbnail,
      process.env.CLOUDINARY_FOLDER_NAME as string
    );

    // Create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImageUploaded.secure_url,
      status: courseStatus,
      instructions: instructions,
    });

    // now update the user(instructor) by adding this course id to the user model course

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // Update the category schema
    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course has been created succesfully.",
      courseData: {
        newCourse: {
          course: newCourse,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Update course details:

export const editCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId, ...updatesRaw } = req.body;
    const updates: CourseUpdate = updatesRaw;
    logger.info("Updates coming as: ", updates);

    // find course
    const course = await Course.findById(courseId);

    if (!course) {
      return next(new NotFoundError("Course not found with the given id."));
    }

    // If thumbnail image is found
    // First delete the previous image from cloud
    if (req.files && req.files.thumbnailImage) {
      const thumbnail: UploadedFile = req.files.thumbnailImage as UploadedFile;
      if (course.thumbnail) {
        const publicId = course.thumbnail
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];

        if (publicId) {
          const deletedImgResultStatus = await destroyImageFromCloudinary(
            publicId
          );
          logger.info("DeletedImgResultStatus: ", deletedImgResultStatus);
        }
      }

      // Now take the incoming image and upload it
      const newThumbnail = req.files.thumbnailImage;
      const newThumbnailImage = await uploadImageToCloudinary(
        newThumbnail,
        process.env.CLOUDINARY_FOLDER_NAME as string
      );
      logger.info("Updated course image result: ", newThumbnailImage);

      course.thumbnail = newThumbnailImage.secure_url;
    }

    // Updated the fields which comes in request body
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        const k = key as keyof CourseUpdate;
        const value = updates[k];

        if (k === "tag" || k === "instructions") {
          if (typeof value === "string") {
            course.set(k, JSON.parse(value) as string[]);
          } else if (Array.isArray(value)) {
            course.set(k, value);
          }
        } else if (value !== undefined) {
          course.set(k, value);
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Course has been updated with the new updates.",
      data: updatedCourse,
    });
    return;
  } catch (error) {
    logger.error("Error in editing course: ", error);
    return next(error);
  }
};

// Get all courses handler function:

export const getAllCourses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched successfully.",
      data: {
        allCourses: {
          coursesData: allCourses,
        },
      },
    });
  } catch (error) {
    logger.error("Error in getting all courses: ", error);
    return next(error);
  }
};

export const getCourseDetails = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Request comes to get course details.");

    const { courseId } = req.body;
    const courseDetails = (await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()) as unknown as ICoursePopulated;

    if (!courseDetails) {
      return next(
        new NotFoundError(`Could not find course with id: ${courseId}`)
      );
    }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    });
  } catch (error) {
    logger.error("Error in getting course details: ", error);
    return next(error);
  }
};

// Get all courses made by an instructor

export const getInstructorCourses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // get the instructor id
    const instructorId = req.auth?.authUser?.id;

    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All courses of the instructor have been fetched successfully.",
      data: {
        totalCourses: instructorCourses.length,
        instructorCourses: instructorCourses,
      },
    });
    return;
  } catch (error) {
    logger.error("Error in getting instructor courses: ", error);
    return next(error);
  }
};

// Delete the Course:

export const deleteCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.body;

    // Find the Course:
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new NotFoundError("Course not found with the given id."));
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete section and subsections of the course
    const courseSections = course.courseContent;

    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }
      await Section.findByIdAndDelete(sectionId);
    }

    // Now delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course Deleted Successfully!",
    });
  } catch (error) {
    logger.error("Error in deleting course: ", error);
    return next(error);
  }
};

// Get Full course details:

export const getFullCourseDetails = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.body;
    const userId = req.auth?.authUser?.id;
    const courseDetails = (await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()) as unknown as ICoursePopulated;

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    logger.info("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return next(
        new NotFoundError(`Could not find course with id: ${courseId}`)
      );
    }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    logger.info("Course Details: ", courseDetails);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    });
  } catch (error) {
    logger.error("Error in getting full course details: ", error);
    return next(error);
  }
};

// Get courses acccording to Tags:

export const getTaggedCourses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { searchQuery } = req.query;

    logger.info("Search Query is: ", searchQuery);

    if (
      !searchQuery ||
      Array.isArray(searchQuery) ||
      typeof searchQuery !== "string"
    ) {
      return next(
        new BadRequestError("Search Query is required and must be a string.")
      );
    }

    const queryString = searchQuery as string;

    // Escape the search query to prevent regex injection issues
    const escapedQuery = queryString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (
      !searchQuery ||
      Array.isArray(searchQuery) ||
      typeof searchQuery !== "string"
    ) {
      return next(
        new BadRequestError("Search Query is required and must be a string.")
      );
    }

    const regex = new RegExp(escapedQuery, "i");

    // Query the Course collection
    const courseDetails = await Course.find({
      tag: {
        $in: [regex],
      },
    });

    if (courseDetails.length === 0) {
      return next(
        new NotFoundError("No courses found related to the given tag.")
      );
    }

    // Map the course details to only include courseId and tags
    const results = courseDetails.map((course) => ({
      courseId: course._id,
      tags: course.tag,
      courseName: course.courseName,
    }));

    return res.status(200).json({
      success: true,
      message: "All courses related to tag have been fetched successfully.",
      data: results,
    });
  } catch (error) {
    logger.error("Error in getting tagged courses: ", error);
    return next(error);
  }
};
