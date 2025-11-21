import type { NextFunction, Response } from "express";
import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { RatingAndReviews } from "../models/rating.model.js";
import type { AuthRequest } from "../types/extend-auth.js";
import logger from "../configs/logger.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/error-handler.js";

// Create rating

export const createRating = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // get userId
    const userId = req.auth?.authUser?.id;

    // fetch data from req body
    const { rating, review, courseId } = req.body;

    // check user has bought the course means he is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: {
        $elemMatch: { $eq: userId },
      },
    });

    if (!courseDetails) {
      return next(
        new UnauthorizedError("You must be enrolled in the course to rate it.")
      );
    }
    // make sure user hasn't made a review already.
    const alreadyReviewed = await RatingAndReviews.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return next(
        new UnauthorizedError("You have already reviewed this course.")
      );
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
    logger.error("Error in creating rating: ", error);
    return next(error);
  }
};

// Edit rating:
export const modifyRating = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth?.authUser?.id;
    const { reviewId, rating, review } = req.body;
    if (!reviewId || !rating || !review || !userId) {
      return next(new BadRequestError("All fields are mandatory."));
    }

    const reviewDetails = await RatingAndReviews.findById(reviewId);

    if (!reviewDetails) {
      return next(new NotFoundError("Review Details not found!"));
    }

    if (reviewDetails.user.toString() !== userId) {
      return next(
        new UnauthorizedError("You are not authorized to modify this rating.")
      );
    }

    const findedReviewAndUpdate = await RatingAndReviews.findByIdAndUpdate(
      reviewId,
      { rating: rating, review: review },
      { new: true }
    );

    if (!findedReviewAndUpdate) {
      return next(
        new BadRequestError(
          "No review is found with this id. Please provide a valid id."
        )
      );
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
    logger.error("Error in modify rating: ", error);
    return next(error);
  }
};

// Delete Rating
export const deleteRating = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth?.authUser?.id;
    const { reviewId } = req.body;
    if (!reviewId || !userId) {
      return next(new BadRequestError("All fields are mandatory."));
    }

    const reviewDetails = await RatingAndReviews.findById(reviewId);

    if (!reviewDetails) {
      return next(new NotFoundError("Review Details not found!"));
    }

    if (reviewDetails.user.toString() !== userId) {
      return next(
        new UnauthorizedError("You are not authorized to delete this rating.")
      );
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
    logger.error("Error in deleting rating: ", error);
    return next(error);
  }
};

// Get average Rating

export const getAverageRating = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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
    logger.error("Error in getting average rating: ", error);
    return next(error);
  }
};

// get all ratings
export const getAllRatings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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
    logger.error("Error in getting all ratings: ", error);
    return next(error);
  }
};

// get all ratings for specific course

export const getAllRatingsForCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
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
      return next(new NotFoundError("Course not found with this id."));
    }

    // return response
    res.status(200).json({
      success: true,
      message: "All ratings have been fetched successfully for this course.",
      courseRatings: courseDetails,
    });
    return;
  } catch (error) {
    logger.error("Error in getting all ratings for course: ", error);
    return next(error);
  }
};
