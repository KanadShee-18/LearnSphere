const Category = require("../models/Category");
const Course = require("../models/Course");

// Create tag handler function

exports.createCategory = async (req, res) => {
    try {
        // fetch data from req body
        const { name, description } = req.body;

        // validate data
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
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
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//get all categories handler function

exports.showAllCategories = async (req, res) => {
    try {
        // get all tags but make sure that name and description must be present
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
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Category Page Details

exports.categoryPageDetails = async (req, res) => {
    try {
        // Get category id
        const { categoryId } = req.body;
        //Get all courses for a particular category
        const selectedCategory = await Category.findById(categoryId)
            .populate("courses")
            .exec();

        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "No courses found in this category. Try another.",
            });
        }

        // Get courses for different categories -> means where category id !== categoryId
        const differentCategories = await Category.find({
            _id: { $ne: categoryId },
        })
            .populate("courses")
            .exec();

        // Get top 10 selling courses
        const sortedCourses = selectedCategory.courses.sort(
            (a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length
        );

        const topTenCourses = sortedCourses.slice(0, 10);

        return res.status(200).json({
            success: true,
            message:
                "All courses have been fetched successfully on the basic of category and other catergories also.",
            data: {
                coursesData: {
                    courses: [
                        {
                            selectedCategoryCourses: selectedCategory,
                        },
                        {
                            differentCategoriesCourses: differentCategories,
                        },
                        {
                            top10Courses: topTenCourses,
                        },
                    ],
                },
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get courses for this category.",
            error: error.message,
        });
    }
};
