const mongoose = require("mongoose");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const User = require("../models/User");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subSectionId } = req.body;
  const userId = req.user.id;

  try {
    // Check if the subsection exists
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "Invalid subsection.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Registered!",
      });
    }

    // Check if course progress exists for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      // If no course progress exists, create a new one
      return res.status(404).json({
        success: false,
        message: "Course progress does not exist.",
      });
    } else {
      // If course progress exists, check if the sub-section is already completed
      if (courseProgress.completedVideos.includes(subSectionId)) {
        return res
          .status(400)
          .json({ error: "SubSection is already completed!" });
      }

      // Add the subsection to the list of completed videos
      courseProgress.completedVideos.push(subSectionId);
    }

    if (!user.courseProgress.includes(courseProgress._id)) {
      user.courseProgress.push(courseProgress._id);
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
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Some error occurred while updating the course progress.",
    });
  }
};
