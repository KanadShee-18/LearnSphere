const express = require("express");
const router = express.Router();

// Auth:
const { auth, isInstructor } = require("../middlewares/auth");
const { fileUploadAuth } = require("../middlewares/FileUploadAuth");

// Profile handler function:
const {
  updateProfile,
  deleteProfile,
  getUserAllDetails,
  getEnrolledCourses,
  updateDisplayPicture,
  instructorDashboard,
} = require("../controllers/Profile");

// Profile routes:
router.delete("/deleteProfile", auth, deleteProfile);
router.get("/getUserDetails", getUserAllDetails);
router.put("/updateProfile", auth, updateProfile);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, fileUploadAuth, updateDisplayPicture);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;
