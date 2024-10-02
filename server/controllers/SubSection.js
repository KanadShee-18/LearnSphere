const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const {
  uploadImageToCloudinary,
  destroyVideoFromCloudinary,
} = require("../utils/imageUploader");

// Create SubSection:

exports.createSubSection = async (req, res) => {
  try {
    // Fetch data from body
    const { sectionId, title, timeDuration, description } = req.body;
    // fetch video from req.files
    const video = req.files.video;
    // validate
    if (!sectionId || !title || !description || !video) {
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
    console.log("Uploaded video details from cldnry: ", uploadVideoDetails);

    // create sub-section with fetched data and secure_url
    const newSubSection = await SubSection.create({
      title: title,
      timeDuration: `${uploadVideoDetails.duration}`,
      description: description,
      videoUrl: uploadVideoDetails.secure_url,
      publicId: uploadVideoDetails.public_id,
    });
    // update section schema with the created sub-section _id.
    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: newSubSection._id } },
      { new: true }
    ).populate("subSection");

    console.log("Updated sub section details: ", updatedSection);

    // Return the updated section in the response
    return res.status(200).json({ success: true, data: updatedSection });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Some error occurred while creating the sub-section",
    });
  }
};

// Update Sub-section:

exports.updateSubSection = async (req, res) => {
  try {
    // Fetch data from req body
    const { sectionId, subSectionId, title, description } = req.body;

    // Check if subsection present with the id
    const checkSubSection = await SubSection.findById(subSectionId);
    if (!checkSubSection) {
      return res.status(400).json({
        success: false,
        message: "No sub-section is available with this id.",
      });
    }

    const publicId = checkSubSection.publicId;

    const deletedImg = await destroyVideoFromCloudinary(publicId);
    console.log(deletedImg);

    // Validate
    if (title !== undefined) {
      checkSubSection.title = title;
    }
    if (description !== undefined) {
      checkSubSection.description = description;
    }

    // Upload new video to cloudiniary
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.CLOUDINARY_FOLDER_NAME
      );
      console.log("Uploaded video details: ", uploadDetails);

      checkSubSection.videoUrl = uploadDetails.secure_url;
      checkSubSection.timeDuration = `${uploadDetails.duration}`;
    }

    await checkSubSection.save();

    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    console.log("Updated subsection in section: ", updatedSection);

    // return success response
    return res.status(200).json({
      success: true,
      message: "Sub-section has been updated successfully.",
      data: updatedSection,
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
    console.log("Request comes to backend to delete subsection...");

    const { subSectionId, sectionId } = req.body;
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    );
    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });
    // Validate:
    if (!subSection) {
      return res.status(400).json({
        success: false,
        message: "No sub-section is available with this id.",
      });
    }

    // Remove the deleted subsection id from the section schema also
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    console.log("Updated Section after deleteing subsection: ", updatedSection);

    // return success response
    return res.status(200).json({
      success: true,
      message: "Sub-section has been deleted successfully.",
      data: updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      messgae: "Some error occurred while deleting the sub-section.",
    });
  }
};
