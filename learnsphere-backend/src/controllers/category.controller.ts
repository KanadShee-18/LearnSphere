import type { NextFunction, Response } from "express";
import { Category } from "../models/category.model.js";
import { type ICourse } from "../models/course.model.js";
import type { AuthRequest } from "../types/extend-auth.js";
import { BadRequestError, NotFoundError } from "../utils/error-handler.js";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

// Create tag handler function

export const createCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // fetch data from req body
    const { name, description } = req.body;

    // validate data
    if (!name || !description) {
      return next(
        new BadRequestError(
          "Name and Description are required to create a category."
        )
      );
    }

    // create entry in db
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    // send success response
    return res.status(200).json({
      success: true,
      message: "Category crated successfully.",
      category: categoryDetails,
    });
  } catch (error) {
    return next(error);
  }
};

//get all categories handler function

export const showAllCategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );

    res.status(200).json({
      success: true,
      message: "All categories fetched successfully.",
      categoryDetails: {
        categories: allCategories,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Category Page Details

export const categoryPageDetails = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get category id
    const { categoryId } = req.body;
    // logger.info("Category ID comes from client: ", categoryId);

    //Get all courses for a particular category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    if (!selectedCategory) {
      // logger.error("Category not found!");
      return next(new NotFoundError("Category not found!"));
    }

    if (selectedCategory.courses.length === 0) {
      // logger.warn("No courses found on this selected category.");
      return next(
        new NotFoundError("No courses found on this selected category!")
      );
    }

    // Get courses for different categories -> means where category id !== categoryId
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });

    let differentCategory = null;

    if (categoriesExceptSelected.length > 0) {
      const randomIndex = getRandomInt(categoriesExceptSelected.length);
      const randomCategory = categoriesExceptSelected[randomIndex];

      if (randomCategory?._id) {
        differentCategory = await Category.findOne({ _id: randomCategory._id })
          .populate({
            path: "courses",
            match: { status: "Published" },
            populate: {
              path: "instructor",
            },
          })
          .exec();
      }
    }

    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec();

    const allCourses = allCategories.flatMap(
      (category) => category.courses as ICourse[]
    );
    const mostSellingCourses = allCourses
      .sort((a, b) => b.studentsEnrolled?.length - a.studentsEnrolled?.length)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      message:
        "All courses have been fetched successfully on the basic of category and other catergories also.",
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
    return;
  } catch (error) {
    return next(error);
  }
};
