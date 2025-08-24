import { Types } from "mongoose";

import type { Response } from "express";
import { CourseProgress } from "../models/CourseProgress.js";
import { SubSection } from "../models/SubSection.js";
import { User, type IUser } from "../models/User.js";
import type { AuthRequest } from "../types/extend-auth.js";

export const updateCourseProgress = async (req: AuthRequest, res: Response) => {
  const { courseId, subSectionId } = req.body;
  const userId = req.auth?.authUser?.id;

  try {
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    // Check if the subsection exists
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      res.status(404).json({
        success: false,
        message: "Invalid subsection.",
      });
      return;
    }

    const user = (await User.findById(userId)) as IUser & {
      courseProgress: Types.ObjectId[];
    };
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User Not Registered!",
      });
      return;
    }

    // Check if course progress exists for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      // If no course progress exists, create a new one
      res.status(404).json({
        success: false,
        message: "Course progress does not exist.",
      });
      return;
    } else {
      // If course progress exists, check if the sub-section is already completed
      if (courseProgress.completedVideos.includes(subSectionId)) {
        res.status(400).json({ error: "SubSection is already completed!" });
        return;
      }

      // Add the subsection to the list of completed videos
      courseProgress.completedVideos.push(subSectionId);
    }

    if (
      !user.courseProgress.some((cp) => cp.toString() === courseProgress._id)
    ) {
      user.courseProgress.push(courseProgress._id as Types.ObjectId);
    }

    // Save the course progress (new or updated)
    await courseProgress.save();
    await user.save();

    console.log(courseProgress.completedVideos);

    return res.status(200).json({
      success: true,
      message: "Course progress has been marked/updated.",
    });
  } catch (error) {
    console.log("Error in Updating course progress: ", error);
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
