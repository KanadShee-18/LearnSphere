import type { Response } from "express";
import { Category } from "../models/Category.js";
import { type ICourse } from "../models/Course.js";
import type { AuthRequest } from "../types/extend-auth.js";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

// Create tag handler function

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    // fetch data from req body
    const { name, description } = req.body;

    // validate data
    if (!name || !description) {
      res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
      return;
    }

    // create entry in db
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    // send success response
    res.status(200).json({
      success: true,
      message: "Category crated successfully.",
      category: categoryDetails,
    });
    return;
  } catch (error) {
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

//get all categories handler function

export const showAllCategories = async (req: AuthRequest, res: Response) => {
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

// Category Page Details

export const categoryPageDetails = async (req: AuthRequest, res: Response) => {
  try {
    // Get category id
    const { categoryId } = req.body;
    // console.log("Category ID comes from client: ", categoryId);

    //Get all courses for a particular category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    if (!selectedCategory) {
      // console.log("Category not found!");
      res.status(404).json({
        success: false,
        message: "Category Not Found.",
      });
      return;
    }

    if (selectedCategory.courses.length === 0) {
      // console.log("No courses found on this selected category.");
      res.status(404).json({
        success: false,
        message: "No courses found on this selected category!",
      });
      return;
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
