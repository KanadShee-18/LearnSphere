const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
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
      tag,
      category,
      status,
      instructions,
    } = req.body;

    // get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //Validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !category ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (!status || status === undefined) {
      status = "Draft";
    }

    // Check if it is insturctor or not if yes then we have to put the instructor id to the course as we have mentioned that in model
    const userId = req.user.id; // comes from payload
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });

    if (!instructorDetails) {
      return res.stauts(400).json({
        success: false,
        message: "Instructor details not found.",
      });
    }

    // Check given tag is valid or not...
    const categoryDetails = await Category.findById(category); // as we have received tag as id from course model

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

    // Update the tag schema
    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          course: newCourse._id,
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

exports.getCourseDetails = async (req, res) => {
  try {
    // Get course id:
    const { courseId } = req.body;

    // Fetch course details
    const courseDetails = await Course.find({ _id: courseId })
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

    // validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with course id ${courseId}`,
      });
    }

    // send success response
    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully.",
      courseDetails: {
        detailsOfCourse: {
          courseInDetail: courseDetails,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while getting data of a course.",
      error: error.message,
    });
  }
};
