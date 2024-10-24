const Course = require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section");
const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");
const User = require("../models/User");
const {
  uploadImageToCloudinary,
  destroyImageFromCloudinary,
} = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
require("dotenv").config();

// Create Course handler function:

exports.createCourse = async (req, res) => {
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
    console.log("Req file receives as: ", req.files.thumbnailImage);

    // get thumbnail
    const thumbnail = req.files.thumbnailImage;

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
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (!status || status === undefined) {
      status = "Draft";
    }

    const userId = req.user.id;
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });

    if (!instructorDetails) {
      return res.stauts(400).json({
        success: false,
        message: "Instructor details not found.",
      });
    }

    const categoryDetails = await Category.findById(category);

    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category details not found.",
      });
    }

    // After all validation, upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.CLOUDINARY_FOLDER_NAME
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
      thumbnail: thumbnailImage.secure_url,
      status: status,
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
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Some error occurred while creatting the course.",
    });
  }
};

// Update course details:

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;

    console.log("Updates coming as: ", updates);

    // find course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "No Course Found!",
      });
    }

    // If thumbnail image is found
    // First delete the previous image from cloud
    if (req.files && req.files.thumbnailImage) {
      const thumbnail = course.thumbnail;
      const publicId = thumbnail.split("/").slice(-2).join("/").split(".")[0];

      const deletedImgResultStatus = await destroyImageFromCloudinary(publicId);
      console.log("DeletedImgResultStatus: ", deletedImgResultStatus);

      // Now take the incoming image and upload it
      const newThumbnail = req.files.thumbnailImage;
      const newThumbnailImage = await uploadImageToCloudinary(
        newThumbnail,
        process.env.CLOUDINARY_FOLDER_NAME
      );
      console.log("Updated course image result: ", newThumbnailImage);

      course.thumbnail = newThumbnailImage.secure_url;
    }

    // Updated the fields which comes in request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
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

    return res.status(200).json({
      success: true,
      message: "Course has been updated with the new updates.",
      data: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Some error occurred while editing the course. Internal server error!",
      error: error.message,
    });
  }
};

// Get all courses handler function:

exports.getAllCourses = async (req, res) => {
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
    res.stauts(500).json({
      success: false,
      messgae: "Error occurred while fetching all courses.",
      error: error.message,
    });
  }
};

// Get course details:

// exports.getCourseDetails = async (req, res) => {
//   try {
//     // Get course id:
//     const { courseId } = req.body;

//     // Fetch course details
//     const courseDetails = await Course.find({ _id: courseId })
//       .populate({
//         path: "instructor",
//         populate: {
//           path: "additionalDetails",
//         },
//       })
//       .populate("category")
//       .populate("ratingAndReviews")
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//           select: "-videoUrl",
//         },
//       })
//       .exec();

//     // validation
//     if (!courseDetails) {
//       return res.status(400).json({
//         success: false,
//         message: `Could not find course with course id ${courseId}`,
//       });
//     }

//     // send success response
//     return res.status(200).json({
//       success: true,
//       message: "Course details fetched successfully.",
//       courseDetails: {
//         detailsOfCourse: {
//           courseInDetail: courseDetails,
//         },
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error occurred while getting data of a course.",
//       error: error.message,
//     });
//   }
// };

exports.getCourseDetails = async (req, res) => {
  try {
    console.log("Request comes to get course details.");

    const { courseId } = req.body;
    const courseDetails = await Course.findOne({
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
      .exec();

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

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all courses made by an instructor

exports.getInstructorCourses = async (req, res) => {
  try {
    // get the instructor id
    const instructorId = req.user.id;
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal error occurred while getting instructor courses.",
      error: error.message,
    });
  }
};

// Delete the Course:

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the Course:
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
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
    return res.status(500).json({
      success: false,
      message: "Some error occurred while deleting the course.",
      error: error.message,
    });
  }
};

// Get Full course details:

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await Course.findOne({
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
      .exec();

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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
