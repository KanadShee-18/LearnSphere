import { Types } from "mongoose";

import type { NextFunction, Response } from "express";
import { CourseProgress } from "../models/courseProgress.model.js";
import { SubSection } from "../models/subSection.model.js";
import { User, type IUser } from "../models/user.model.js";
import type { AuthRequest } from "../types/extend-auth.js";
import logger from "../configs/logger.js";
import { BadRequestError, NotFoundError } from "../utils/error-handler.js";

export const updateCourseProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { courseId, subSectionId } = req.body;
  const userId = req.auth?.authUser?.id;

  try {
    if (!userId) {
      return next(new BadRequestError("User ID is required."));
    }
    // Check if the subsection exists
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return next(new NotFoundError("SubSection does not exist."));
    }

    const user = (await User.findById(userId)) as IUser & {
      courseProgress: Types.ObjectId[];
    };
    if (!user) {
      return next(new NotFoundError("User does not exist."));
    }

    // Check if course progress exists for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      // If no course progress exists, create a new one
      return next(new NotFoundError("Course progress does not exist."));
    } else {
      // If course progress exists, check if the sub-section is already completed
      if (courseProgress.completedVideos.includes(subSectionId)) {
        return next(
          new BadRequestError(
            "This sub-section is already marked as completed."
          )
        );
      } else {
        courseProgress.completedVideos.push(subSectionId);
      }
    }

    if (
      !user.courseProgress.some(
        (cp) => cp.toString() === courseProgress._id.toString()
      )
    ) {
      user.courseProgress.push(courseProgress._id as Types.ObjectId);
    }

    // Save the course progress (new or updated)
    await courseProgress.save();
    await user.save();

    logger.info("Updated completed videos: ", courseProgress.completedVideos);

    return res.status(200).json({
      success: true,
      message: "Course progress has been marked/updated.",
    });
  } catch (error) {
    logger.error("Error in Updating course progress: ", error);
    return next(error);
  }
};
