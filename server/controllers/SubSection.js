const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create SubSection:

exports.createSubSection = async (req, res) => {
  try {
    // Fetch data from body
    const { sectionId, title, timeDuration, description } = req.body;
    // fetch video from req.files
    const video = req.files.videoFile;
    // validate
    if (!sectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
    const findSection = await Section.findById(sectionId);
    if (!findSection) {
      return res.status(400).json({
        success: false,
        message: "No sections is available with this id.",
      });
    }
    // upload video to cloudinary and get the secure_url
    const uploadVideoDetails = await uploadImageToCloudinary(
      video,
      process.env.CLOUDINARY_FOLDER_NAME
    );
    // create sub-section with fetched data and secure_url
    const newSubSection = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadVideoDetails.secure_url,
    });
    // update section schema with the created sub-section _id.
    await Section.findByIdAndUpdate(sectionId, {
      $push: {
        subSection: newSubSection._id,
      },
    }).populate("subSection");

    // get updated details
    const findUpdatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    // return success response
    return res.status(200).json({
      success: true,
      message: "New sub-section has been created successfully.",
      data: {
        sectionAndsubSectionDetails: {
          data: [
            {
              subSectionData: newSubSection,
            },
            {
              sectionData: findUpdatedSection,
            },
          ],
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred while creating the sub-section",
    });
  }
};

// Update Sub-section:

exports.updateSubSection = async (req, res) => {
  try {
    // Fetch data from req body
    const { subSectionId, title, timeDuration, description } = req.body;
    // get video req files
    const newVideo = req.files.videoFile;

    // Validate
    if (!subSectionId || !title) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    // Check if subsection present with the id
    const checkSubSection = await SubSection.findById(subSectionId);
    if (!checkSubSection) {
      return res.status(400).json({
        success: false,
        message: "No sub-section is available with this id.",
      });
    }
    // Upload new video to cloudiniary
    const newVideoUploadDetails = await uploadImageToCloudinary(
      newVideo,
      process.env.CLOUDINARY_FOLDER_NAME
    );

    // Update sub-section details:
    const updatedSubSectionDetails = await SubSection.findByIdAndUpdate(
      subSectionId,
      {
        title: title,
        timeDuration: timeDuration,
        description: description,
        videoUrl: newVideoUploadDetails.secure_url,
      },
      { new: true }
    );
    // return success response
    return res.status(200).json({
      success: true,
      message: "Sub-section has been updated successfully.",
      updatedDetails: {
        data: [
          {
            sub_section_updated: updatedSubSectionDetails,
          },
        ],
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Some error occurred while updating the sub-section.",
    });
  }
};

// Delete sub-section:

exports.deleteSubSection = async (req, res) => {
  try {
    // Fetch the subsection id from the params
    const { subSectionId } = req.params;
    // Check that subsection is present or not
    const findSubSection = await SubSection.findById(subSectionId);
    // Validate:
    if (!findSubSection) {
      return res.status(400).json({
        success: false,
        message: "No sub-section is available with this id.",
      });
    }
    // Delete sub-section
    const deletedSubSection = await SubSection.findByIdAndDelete(
      subSectionId
    ).exec();
    // Remove the deleted subsection id from the section schema also
    await Section.updateOne(
      { subSection: subSectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    );
    // return success response
    return res.status(200).json({
      success: true,
      message: "Sub-section has been deleted successfully.",
      deletedSubSection: {
        data: {
          deleted_subSection: deletedSubSection,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      messgae: "Some error occurred while deleting the sub-section.",
    });
  }
};
