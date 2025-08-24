import express, { Router } from "express";
const router: Router = express.Router();

// Course Controllers import
import {
  createCourse,
  deleteCourse,
  editCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  getInstructorCourses,
  getTaggedCourses,
} from "../controllers/Course.js";

// Category Controllers import
import {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} from "../controllers/Category.js";

// Section controllers imports
import {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/Section.js";

// Sub-Section controllers imports
import {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} from "../controllers/SubSection.js";

// Ratings controllers imports
import {
  createRating,
  getAverageRating,
  getAllRatings,
  getAllRatingsForCourse,
  modifyRating,
  deleteRating,
} from "../controllers/RatingAndReview.js";

// Course progress controller:
import { updateCourseProgress } from "../controllers/CourseProgress.js";

// Middlewares importing from Auth
import { auth, isStudent, isInstructor, isAdmin } from "../middlewares/auth.js";

// ******************************************

// Course Routes:

// ******************************************

// Course creation routes:
router.post("/course/createCourse", auth, isInstructor, createCourse);
router.post("/course/editCourse", auth, isInstructor, editCourse);
router.post("/course/addSection", auth, isInstructor, createSection);
router.post("/course/updateSection", auth, isInstructor, updateSection);
router.post("/course/deleteSection", auth, isInstructor, deleteSection);
router.post("/course/addSubSection", auth, isInstructor, createSubSection);
router.post("/course/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/course/deleteSubSection", auth, isInstructor, deleteSubSection);
router.delete("/course/deleteCourse", deleteCourse);

// Getting all courses:
router.get("/course/getAllCourses", getAllCourses);
// Getting details for a specific course:
router.post("/course/getCourseDetails", getCourseDetails);
router.post("/course/getFullCourseDetails", auth, getFullCourseDetails);
router.get(
  "/course/getInstructorCourses",
  auth,
  isInstructor,
  getInstructorCourses
);

// Update course progress route:
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// Routes for Admin
router.post("/course/createcategory", auth, isAdmin, createCategory);
router.get("/course/showallcategories", showAllCategories);
router.post("/course/getCategoryPageDetails", categoryPageDetails);

// Routes for ratings and reviews:
router.post("/course/createRating", auth, isStudent, createRating);
router.get("/course/getAverageRating", getAverageRating);
router.get("/course/getAllRatingsAndReviews", getAllRatings);
router.get("/course/getCourseReviews/:courseId", getAllRatingsForCourse);
router.get("/course/getCourseReviews", getAllRatingsForCourse);
router.post("/course/modifyRating", auth, isStudent, modifyRating);
router.delete("/course/destroyRating", auth, isStudent, deleteRating);

// Get all courses related to tags:
router.get("/course/tags/courses", getTaggedCourses);

export default router;
