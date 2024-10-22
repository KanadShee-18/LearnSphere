const { default: mongoose } = require("mongoose");
const RatingAndReview = require("../models//RatingAndReviews");
const Course = require("../models/Course");

// Create rating

exports.createRating = async (req, res) => {
  try {
    // get userId
    const userId = req.user.id;

    // fetch data from req body
    const { rating, review, courseId } = req.body;
    console.log("Rating: ", rating);

    // check user has bought the course means he is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: {
        $elemMatch: { $eq: userId },
      },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course.",
      });
    }
    // make sure user hasn't made a review already.
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course has already been reviewed. Thank You!",
      });
    }
    // create rating and review
    const createdRatingAndReview = await RatingAndReview.create({
      user: userId,
      rating: rating,
      review: review,
      course: courseId,
    });
    // update course with this rating id
    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: createdRatingAndReview._id,
        },
      },
      { new: true }
    ).populate("ratingAndReviews");
    // return success response
    return res.status(200).json({
      success: true,
      message: "Rating has been created successfully.",
      data: {
        createdRatingAndReview,
        updatedCourse,
      },
    });
  } catch (error) {
    return res.status(200).json({
      error: error.message,
      success: false,
      message: "Some error occurred while creating rating.",
    });
  }
};

// Edit rating:
exports.modifyRating = async (req, res) => {
  try {
    const { reviewId, rating, review, userId } = req.body;
    if (!reviewId || !rating || !review || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory.",
      });
    }

    const reviewDetails = await RatingAndReview.findById(reviewId);

    if (reviewDetails.user.toString() !== userId) {
      return res.status(400).json({
        success: false,
        messgae: "You are not authorized to modify this rating.",
      });
    }

    const findedReviewAndUpdate = await RatingAndReview.findByIdAndUpdate(
      reviewId,
      { rating: rating, review: review },
      { new: true }
    );

    if (!findedReviewAndUpdate) {
      return res.status(400).json({
        success: false,
        message: "No review is found with this id. Please provide a valid id.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review has been updated successfully.",
      data: {
        updated_review: {
          review: findedReviewAndUpdate,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occurred while modifying the rating.",
      error: error.message,
    });
  }
};

// Delete Rating
exports.deleteRating = async (req, res) => {
  try {
    const { reviewId, userId } = req.body;
    if (!reviewId || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory.",
      });
    }

    const reviewDetails = await RatingAndReview.findById(reviewId);

    if (reviewDetails.user.toString() !== userId) {
      return res.status(400).json({
        success: false,
        messgae: "You are not authorized to modify this rating.",
      });
    }

    const courseId = reviewDetails.course;

    const deletedReview = await RatingAndReview.findByIdAndDelete(reviewId);

    const updateCourseReview = await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: {
          ratingAndReviews: reviewId,
        },
      },
      { new: true }
    ).populate("ratingAndReviews");

    return res.status(200).json({
      success: true,
      message: `Rating has been destroyed successfully by the user with id ${userId}`,
      details: {
        data: [
          {
            deleted_review: deletedReview,
          },
          {
            updated_course: updateCourseReview,
          },
        ],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Some error occurred while destroying the review. Please try again!",
      error: error.message,
    });
  }
};

// Get average Rating

exports.getAverageRating = async (req, res) => {
  try {
    // get course id from body
    const { courseId } = req.body;

    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    // average rating calculation
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: courseObjectId,
        },
      },
      {
        $group: {
          _id: null, // means making all entries in single group
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    // return rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        messgae: "Average rating has been calculated",
        averageRating: result[0].averageRating,
      });
    }
    // if no rating or reviews exists send 0 rating
    return res.status(200).json({
      success: true,
      message: "No reviews has been found on this course.",
      averageRating: 0,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Some error occurred to get the average rating.",
    });
  }
};

// get all ratings
exports.getAllRatings = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully.",
      allRatings: {
        data: allReviews,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred while fetching all reviews.",
    });
  }
};

// get all ratings for specific course

exports.getAllRatingsForCourse = async (req, res) => {
  try {
    // Get course id:
    const { courseId } = req.body;

    // validate
    const courseDetails = await Course.findById(courseId).populate({
      path: "ratingAndReviews",
      select: "user rating review",
    });
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course found.",
      });
    }

    // return response
    return res.status(200).json({
      success: true,
      message: "All ratings have been fetched successfully for this course.",
      courseRatings: courseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Some error occurred while fetching all ratings and reviews for the course.",
    });
  }
};
