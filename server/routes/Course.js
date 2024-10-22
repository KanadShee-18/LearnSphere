const express = require("express");
const router = express.Router();

// Course Controllers import
const {
  createCourse,
  editCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/Course");

// Category Controllers import
const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} = require("../controllers/Category");

// Section controllers imports
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// Sub-Section controllers imports
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");

// Ratings controllers imports
const {
  createRating,
  getAverageRating,
  getAllRatings,
  getAllRatingsForCourse,
  modifyRating,
  deleteRating,
} = require("../controllers/RatingAndReview");

// Course progress controller:
const { updateCourseProgress } = require("../controllers/CourseProgress");

// Middlewares importing from Auth
const {
  auth,
  isStudent,
  isInstructor,
  isAdmin,
} = require("../middlewares/auth");

// ******************************************

// Course Routes:

// ******************************************

// Course creation routes:
router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/editCourse", auth, isInstructor, editCourse);
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
router.delete("/deleteCourse", deleteCourse);

// Getting all courses:
router.get("/getAllCourses", getAllCourses);
// Getting details for a specific course:
router.post("/getCourseDetails", getCourseDetails);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

// Update course progress route:
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// Routes for Admin
router.post("/createcategory", auth, isAdmin, createCategory);
router.get("/showallcategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// Routes for ratings and reviews:
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllRatingsAndReviews", getAllRatings);
router.get("/getCourseReviews", getAllRatingsForCourse);
router.get("/getCourseReviews", getAllRatingsForCourse);
router.post("/modifyRating", auth, isStudent, modifyRating);
router.post("/destroyRating", auth, isStudent, deleteRating);

module.exports = router;
