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
} from "../controllers/course.controller.js";

// Category Controllers import
import {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} from "../controllers/category.controller.js";

// Section controllers imports
import {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/section.controller.js";

// Sub-Section controllers imports
import {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} from "../controllers/subSection.controller.js";

// Ratings controllers imports
import {
  createRating,
  getAverageRating,
  getAllRatings,
  getAllRatingsForCourse,
  modifyRating,
  deleteRating,
} from "../controllers/ratings.controller.js";

import { aiContent } from "../ai/gemini.js";

// Course progress controller:
import { updateCourseProgress } from "../controllers/courseProgress.controller.js";

// Middlewares importing from Auth
import {
  auth,
  isStudent,
  isInstructor,
  isAdmin,
} from "../middlewares/auth.middleware.js";
import { aiContent_groq } from "../ai/groq.js";
import { generateAIthumbnail } from "../ai/hugging-face.js";

// ******************************************

// Course Routes:

// ******************************************

// Course creation routes:

// #swagger.tags = ['Course']
router.post("/course/createCourse", auth, isInstructor, createCourse);
// #swagger.tags = ['Course']
router.post("/course/editCourse", auth, isInstructor, editCourse);
// #swagger.tags = ['Course']
router.post("/course/addSection", auth, isInstructor, createSection);
// #swagger.tags = ['Course']
router.post("/course/updateSection", auth, isInstructor, updateSection);
// #swagger.tags = ['Course']
router.post("/course/deleteSection", auth, isInstructor, deleteSection);
// #swagger.tags = ['Course']
router.post("/course/addSubSection", auth, isInstructor, createSubSection);
// #swagger.tags = ['Course']
router.post("/course/updateSubSection", auth, isInstructor, updateSubSection);
// #swagger.tags = ['Course']
router.post("/course/deleteSubSection", auth, isInstructor, deleteSubSection);
// #swagger.tags = ['Course']
router.delete("/course/deleteCourse", deleteCourse);

// Getting all courses:

// #swagger.tags = ['Course']
router.get("/course/getAllCourses", getAllCourses);

// Getting details for a specific course:

// #swagger.tags = ['Course']
router.post("/course/getCourseDetails", getCourseDetails);
// #swagger.tags = ['Course']
router.post("/course/getFullCourseDetails", auth, getFullCourseDetails);
// #swagger.tags = ['Course']
router.get(
  "/course/getInstructorCourses",
  auth,
  isInstructor,
  getInstructorCourses
);

// Update course progress route:

// #swagger.tags = ['Course']
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// Routes for Admin

// #swagger.tags = ['Course']
router.post("/course/createcategory", auth, isAdmin, createCategory);
// #swagger.tags = ['Course']
router.get("/course/showallcategories", showAllCategories);
// #swagger.tags = ['Course']
router.post("/course/getCategoryPageDetails", categoryPageDetails);

// Routes for ratings and reviews:

// #swagger.tags = ['Course']
router.post("/course/createRating", auth, isStudent, createRating);
// #swagger.tags = ['Course']
router.get("/course/getAverageRating", getAverageRating);
// #swagger.tags = ['Course']
router.get("/course/getAllRatingsAndReviews", getAllRatings);
// #swagger.tags = ['Course']
router.get("/course/getCourseReviews/:courseId", getAllRatingsForCourse);
// #swagger.tags = ['Course']
router.get("/course/getCourseReviews", getAllRatingsForCourse);
// #swagger.tags = ['Course']
router.post("/course/modifyRating", auth, isStudent, modifyRating);
// #swagger.tags = ['Course']
router.delete("/course/destroyRating", auth, isStudent, deleteRating);

// Get all courses related to tags:

// #swagger.tags = ['Course']
router.get("/course/tags/courses", getTaggedCourses);

// router.post("/get-content", aiContent);

// #swagger.tags = ['Course']
router.post("/course/get-content", auth, aiContent_groq);
// #swagger.tags = ['Course']
router.post("/course/get-thumbnail", auth, generateAIthumbnail);

export default router;
