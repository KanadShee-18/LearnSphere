const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../controllers/SubSection");

// Create section handler function

exports.createSection = async (req, res) => {
  try {
    // Data fetch
    const { sectionName, courseId } = req.body;
    // Data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties.",
      });
    }
    const findCourse = await Course.findById(courseId).exec();
    if (!findCourse) {
      return res.status(404).json({
        success: false,
        message: "No course found with this id.",
      });
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
    return res.status(200).json({
      success: true,
      message: "New section has been created successfully.",
      updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occurred while creating the section.",
    });
  }
};

// Update Section:

exports.updateSection = async (req, res) => {
  try {
    // Data fetch
    const { sectionName, sectionId } = req.body;

    // validate data
    if (!sectionId || !sectionName) {
      return res.status(400).json({
        success: false,
        message: "All properties should be filled.",
      });
    }
    const findSection = await Section.findById(sectionId).exec();
    if (!findSection) {
      return res.status(400).json({
        success: false,
        message: "No section is available with this id.",
      });
    }
    // update section
    const updateSectionDetails = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName: sectionName },
      { new: true }
    );
    // return res
    return res.status(200).json({
      success: true,
      message: "Course section has been updated successfully.",
      updatedData: {
        data: {
          sectionData: updateSectionDetails,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not able to update section, please try again.",
    });
  }
};

// Delete Section:

exports.deleteSection = async (req, res) => {
  console.log("Delete section has been called in backend.");

  try {
    // Fetch id -> assuming we're sending id through params
    console.log("Req body coming as: ", req.body);

    const { sectionId, courseId } = req.body;

    console.log("Section id: ", sectionId);
    console.log("Course id: ", courseId);

    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });

    // validate:
    const sectionDetails = await Section.findById(sectionId);
    if (!sectionDetails) {
      return res.status(400).json({
        success: false,
        message:
          "No section is available with this id in the course. Plese re-check it.",
      });
    }

    // Validate that there are subsections to delete
    if (sectionDetails.subSection && sectionDetails.subSection.length > 0) {
      await SubSection.deleteMany({
        _id: { $in: sectionDetails.subSection },
      });
    }

    // Delete section:
    const deletedSection = await Section.findByIdAndDelete(sectionId);

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
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Some error occurred to delete the course section.",
    });
  }
};
