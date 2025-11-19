// Create section handler function

import type { Response } from "express";
import type { AuthRequest } from "../types/extend-auth.js";
import { Course } from "../models/course.model.js";
import { Section } from "../models/section.model.js";
import { SubSection } from "../models/subSection.model.js";
import logger from "../configs/logger.js";

export const createSection = async (req: AuthRequest, res: Response) => {
  try {
    // Data fetch
    const { sectionName, courseId } = req.body;
    // Data validation
    if (!sectionName || !courseId) {
      res.status(400).json({
        success: false,
        message: "Missing properties.",
      });
      return;
    }
    const findCourse = await Course.findById(courseId).exec();
    if (!findCourse) {
      res.status(404).json({
        success: false,
        message: "No course found with this id.",
      });
      return;
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

// Update Section:

export const updateSection = async (req: AuthRequest, res: Response) => {
  try {
    // Data fetch
    const { sectionName, sectionId, courseId } = req.body;

    // validate data
    if (!sectionId || !sectionName) {
      res.status(400).json({
        success: false,
        message: "All properties should be filled.",
      });
      return;
    }
    const findSection = await Section.findById(sectionId).exec();
    if (!findSection) {
      res.status(400).json({
        success: false,
        message: "No section is available with this id.",
      });
      return;
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

// Delete Section:

export const deleteSection = async (req: AuthRequest, res: Response) => {
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
      res.status(400).json({
        success: false,
        message:
          "No section is available with this id in the course. Plese re-check it.",
      });
      return;
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
