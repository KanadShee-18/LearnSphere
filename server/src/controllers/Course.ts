import type { AuthRequest } from "../types/extend-auth.js";
import type { Response } from "express";

import { Course, type ICourse } from "../models/Course.js";
import { Category } from "../models/Category.js";
import { Section, type ISection } from "../models/Section.js";
import { SubSection, type ISubSection } from "../models/SubSection.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { User } from "../models/User.js";

import {
  uploadImageToCloudinary,
  destroyImageFromCloudinary,
} from "../utils/imageUploader.js";

import { convertSecondsToDuration } from "../utils/secToDuration.js";
import type { UploadedFile } from "express-fileupload";

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

export const createCourse = async (req: AuthRequest, res: Response) => {
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

    console.log("Req body receives as: ", req.body);
    console.log("Req file receives as: ", req.files?.thumbnailImage);

    // get thumbnail
    const thumbnail = req.files?.thumbnailImage;

    const tag = JSON.parse(_tag);
    const instructions = JSON.parse(_instructions);

    console.log("Tag: ", tag);
    console.log("Instructions: ", instructions);

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
      res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
      return;
    }

    let courseStatus = status || "Draft";

    const userId = req.auth?.authUser?.id;
    const instructorDetails = await User.findOne({
      _id: userId,
      accountType: "Instructor",
    });

    if (!instructorDetails) {
      res.status(400).json({
        success: false,
        message: "Instructor details not found.",
      });
      return;
    }

    const categoryDetails = await Category.findById(category);

    if (!categoryDetails) {
      res.status(404).json({
        success: false,
        message: "Category details not found.",
      });
      return;
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

// Update course details:

export const editCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, ...updatesRaw } = req.body;
    const updates: CourseUpdate = updatesRaw;
    console.log("Updates coming as: ", updates);

    // find course
    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404).json({
        success: false,
        message: "No Course Found!",
      });
      return;
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
          console.log("DeletedImgResultStatus: ", deletedImgResultStatus);
        }
      }

      // Now take the incoming image and upload it
      const newThumbnail = req.files.thumbnailImage;
      const newThumbnailImage = await uploadImageToCloudinary(
        newThumbnail,
        process.env.CLOUDINARY_FOLDER_NAME as string
      );
      console.log("Updated course image result: ", newThumbnailImage);

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

// Get all courses handler function:

export const getAllCourses = async (req: AuthRequest, res: Response) => {
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

export const getCourseDetails = async (req: AuthRequest, res: Response) => {
  try {
    console.log("Request comes to get course details.");

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
      res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
      return;
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

// Get all courses made by an instructor

export const getInstructorCourses = async (req: AuthRequest, res: Response) => {
  try {
    // get the instructor id
    const instructorId = req.auth?.authUser?.id;
    // const { instructorId } = req.body;

    // Find all courses of that instructor and return

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
    console.log(error);
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

// Delete the Course:

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.body;

    // Find the Course:
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found!",
      });
      return;
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
    console.log(`Error in deleting course: ${error}`);
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

// Get Full course details:

export const getFullCourseDetails = async (req: AuthRequest, res: Response) => {
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

    console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    console.log("Course Details: ", courseDetails);

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
    console.log(`Error in getting full course details: ${error}`);
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

// Get courses acccording to Tags:

export const getTaggedCourses = async (req: AuthRequest, res: Response) => {
  try {
    const { searchQuery } = req.query;

    console.log("Search Query is: ", searchQuery);

    if (
      !searchQuery ||
      Array.isArray(searchQuery) ||
      typeof searchQuery !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Search Query is required and must be a string.",
      });
      return;
    }

    const queryString = searchQuery as string;

    // Escape the search query to prevent regex injection issues
    const escapedQuery = queryString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (
      !searchQuery ||
      Array.isArray(searchQuery) ||
      typeof searchQuery !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Search Query is required and must be a string.",
      });
      return;
    }

    const regex = new RegExp(escapedQuery, "i");

    // Query the Course collection
    const courseDetails = await Course.find({
      tag: {
        $in: [regex],
      },
    });

    if (courseDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No courses found for the tag: "${searchQuery}"`,
      });
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
    console.log(`Error in getting tagged courses: ${error}`);
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
