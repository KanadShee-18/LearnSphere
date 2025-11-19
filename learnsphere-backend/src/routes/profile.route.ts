import express, { Router } from "express";
const router: Router = express.Router();

// Auth:
import { auth, isInstructor } from "../middlewares/auth.middleware.js";
import { fileUploadAuth } from "../middlewares/fileUploadAuth.middleware.js";

// Profile handler function:
import {
  updateProfile,
  deleteProfile,
  getUserAllDetails,
  getEnrolledCourses,
  updateDisplayPicture,
  instructorDashboard,
} from "../controllers/profile.controller.js";

// Profile routes:

// #swagger.tags = ['Profile']
router.delete("/profile/deleteProfile", auth, deleteProfile);
// #swagger.tags = ['Profile']
router.get("/profile/getUserDetails", getUserAllDetails);
// #swagger.tags = ['Profile']
router.put("/profile/updateProfile", auth, updateProfile);
// #swagger.tags = ['Profile']
router.get("/profile/getEnrolledCourses", auth, getEnrolledCourses);
// #swagger.tags = ['Profile']
router.put(
  "/profile/updateDisplayPicture",
  auth,
  fileUploadAuth,
  updateDisplayPicture
);
// #swagger.tags = ['Profile']
router.get(
  "/profile/instructorDashboard",
  auth,
  isInstructor,
  instructorDashboard
);

export default router;
