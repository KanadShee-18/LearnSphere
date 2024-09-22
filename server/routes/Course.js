const express = require("express");
const router = express.Router();

// Course Controllers import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
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
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection/:sectionId", auth, isInstructor, deleteSection);
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post(
  "/deleteSubSection/:subSectionId",
  auth,
  isInstructor,
  deleteSubSection
);

// Getting all courses:
router.get("/getAllCourses", getAllCourses);
// Getting details for a specific course:
router.get("/getCourseDetails", getCourseDetails);

// Routes for Admin
router.post("/createcategory", auth, isAdmin, createCategory);
router.get("/showallcategories", showAllCategories);
router.post("/getcategorypagedetails", categoryPageDetails);

// Routes for ratings and reviews:
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllRatingsAndReviews", getAllRatings);
router.get("/getCourseReviews", getAllRatingsForCourse);
router.get("/getCourseReviews", getAllRatingsForCourse);
router.post("/modifyRating", auth, isStudent, modifyRating);
router.post("/destroyRating", auth, isStudent, deleteRating);

module.exports = router;
