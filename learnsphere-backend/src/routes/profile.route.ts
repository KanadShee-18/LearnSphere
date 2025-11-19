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
router.delete("/profile/deleteProfile", auth, deleteProfile);
router.get("/profile/getUserDetails", getUserAllDetails);
router.put("/profile/updateProfile", auth, updateProfile);
router.get("/profile/getEnrolledCourses", auth, getEnrolledCourses);
router.put(
  "/profile/updateDisplayPicture",
  auth,
  fileUploadAuth,
  updateDisplayPicture
);
router.get(
  "/profile/instructorDashboard",
  auth,
  isInstructor,
  instructorDashboard
);

export default router;
