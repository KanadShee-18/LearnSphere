import mongoose from "mongoose";
import { RatingAndReviews } from "../models/rating.model.js";
import { Course } from "../models/course.model.js";
import type { AuthRequest } from "../types/extend-auth.js";
import type { Response } from "express";
import type { Auth } from "googleapis";

// Create rating

export const createRating = async (req: AuthRequest, res: Response) => {
  try {
    // get userId
    const userId = req.auth?.authUser?.id;

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
      res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course.",
      });
      return;
    }
    // make sure user hasn't made a review already.
    const alreadyReviewed = await RatingAndReviews.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      res.status(403).json({
        success: false,
        message: "Course has already been reviewed. Thank You!",
      });
      return;
    }
    // create rating and review
    const createdRatingAndReview = await RatingAndReviews.create({
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
    res.status(200).json({
      success: true,
      message: "Rating has been created successfully.",
      data: {
        createdRatingAndReview,
        updatedCourse,
      },
    });
    return;
  } catch (error) {
    console.log("Error in creating rating: ", error);
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

// Edit rating:
export const modifyRating = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.authUser?.id;
    const { reviewId, rating, review } = req.body;
    if (!reviewId || !rating || !review || !userId) {
      res.status(400).json({
        success: false,
        message: "All fields are mandatory.",
      });
      return;
    }

    const reviewDetails = await RatingAndReviews.findById(reviewId);

    if (!reviewDetails) {
      res.status(404).json({
        success: false,
        message: "Review Details not found!",
      });
      return;
    }

    if (reviewDetails.user.toString() !== userId) {
      res.status(400).json({
        success: false,
        messgae: "You are not authorized to modify this rating.",
      });
      return;
    }

    const findedReviewAndUpdate = await RatingAndReviews.findByIdAndUpdate(
      reviewId,
      { rating: rating, review: review },
      { new: true }
    );

    if (!findedReviewAndUpdate) {
      res.status(400).json({
        success: false,
        message: "No review is found with this id. Please provide a valid id.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Review has been updated successfully.",
      data: {
        updated_review: {
          review: findedReviewAndUpdate,
        },
      },
    });
    return;
  } catch (error) {
    console.log("Error in modify rating: ", error);
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

// Delete Rating
export const deleteRating = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.authUser?.id;
    const { reviewId } = req.body;
    if (!reviewId || !userId) {
      res.status(400).json({
        success: false,
        message: "All fields are mandatory.",
      });
      return;
    }

    const reviewDetails = await RatingAndReviews.findById(reviewId);

    if (!reviewDetails) {
      res.status(404).json({
        success: false,
        message: "Review Details not found!",
      });
      return;
    }

    if (reviewDetails.user.toString() !== userId) {
      res.status(400).json({
        success: false,
        messgae: "You are not authorized to modify this rating.",
      });
      return;
    }

    const courseId = reviewDetails.course;

    const deletedReview = await RatingAndReviews.findByIdAndDelete(reviewId);

    const updateCourseReview = await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: {
          ratingAndReviews: reviewId,
        },
      },
      { new: true }
    ).populate("ratingAndReviews");

    res.status(200).json({
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
    return;
  } catch (error) {
    console.log("Error in deleting rating: ", error);
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

// Get average Rating

export const getAverageRating = async (req: AuthRequest, res: Response) => {
  try {
    // get course id from body
    const { courseId } = req.body;

    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    // average rating calculation
    const result = await RatingAndReviews.aggregate([
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
    console.log("Error in getting average rating: ", error);
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

// get all ratings
export const getAllRatings = async (req: AuthRequest, res: Response) => {
  try {
    const allReviews = await RatingAndReviews.find({})
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

    res.status(200).json({
      success: true,
      message: "All reviews fetched successfully.",
      allRatings: {
        data: allReviews,
      },
    });
    return;
  } catch (error) {
    console.log("Error in getting all ratings: ", error);
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

// get all ratings for specific course

export const getAllRatingsForCourse = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Get course id:
    const { courseId } = req.params;

    // validate
    const courseDetails = await Course.findById(courseId).populate({
      path: "ratingAndReviews",
      select: "user rating review",
      populate: "user",
    });
    if (!courseDetails) {
      res.status(404).json({
        success: false,
        message: "No course found.",
      });
      return;
    }

    // return response
    res.status(200).json({
      success: true,
      message: "All ratings have been fetched successfully for this course.",
      courseRatings: courseDetails,
    });
    return;
  } catch (error) {
    console.log("Error in getting all ratings for course: ", error);
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
