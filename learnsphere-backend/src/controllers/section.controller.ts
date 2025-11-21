// Create section handler function

import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/extend-auth.js";
import { Course } from "../models/course.model.js";
import { Section } from "../models/section.model.js";
import { SubSection } from "../models/subSection.model.js";
import logger from "../configs/logger.js";
import { BadRequestError, NotFoundError } from "../utils/error-handler.js";

export const createSection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Data fetch
    const { sectionName, courseId } = req.body;
    // Data validation
    if (!sectionName || !courseId) {
      return next(new BadRequestError("Missing properties."));
    }
    const findCourse = await Course.findById(courseId).exec();
    if (!findCourse) {
      return next(new NotFoundError("No course found with this id."));
    }
    // Create section
    const newSection = await Section.create({ sectionName: sectionName });
    // Put the section id in course schema
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    ).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    });
    // return response
    res.status(200).json({
      success: true,
      message: "New section has been created successfully.",
      updatedCourse,
    });
    return;
  } catch (error) {
    logger.error("Error in updating course: ", error);
    return next(error);
  }
};

// Update Section:

export const updateSection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Data fetch
    const { sectionName, sectionId, courseId } = req.body;

    // validate data
    if (!sectionId || !sectionName) {
      return next(new BadRequestError("Missing properties."));
    }
    const findSection = await Section.findById(sectionId).exec();
    if (!findSection) {
      return next(new NotFoundError("No section is available with this id."));
    }
    // update section
    const updateSectionDetails = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName: sectionName },
      { new: true }
    ).populate("subSection");

    const course = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    });
    // return res
    res.status(200).json({
      success: true,
      message: `Course section has been updated successfully. Current section is: ${updateSectionDetails}`,
      data: {
        updatedCourse: course,
      },
    });
    return;
  } catch (error) {
    logger.error("Error in updating section of course: ", error);
    return next(error);
  }
};

// Delete Section:

export const deleteSection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  logger.info("Delete section has been called in backend.");

  try {
    // Fetch id -> assuming we're sending id through params
    logger.info("Req body coming as: ", req.body);
    const { sectionId, courseId } = req.body;

    logger.info("Section id: ", sectionId);
    logger.info("Course id: ", courseId);
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });

    // validate:
    const sectionDetails = await Section.findById(sectionId);
    if (!sectionDetails) {
      return next(new NotFoundError("No section found with this id."));
    }

    // Validate that there are subsections to delete
    if (sectionDetails.subSection && sectionDetails.subSection.length > 0) {
      await SubSection.deleteMany({
        _id: { $in: sectionDetails.subSection },
      });
    }

    // Delete section:
    await Section.findByIdAndDelete(sectionId);

    // Removing section id from courseContent array also:
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // return success response
    return res.status(200).json({
      success: true,
      message: "Section has been deleted successfully.",
      data: updatedCourse,
    });
  } catch (error) {
    logger.error("Error in deleting section: ", error);
    return next(error);
  }
};
