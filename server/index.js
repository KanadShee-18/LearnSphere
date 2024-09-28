// Import Dependencies
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// Load environment variables
dotenv.config();

// Create Express App
const app = express();

// Import Routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactRoutes = require("./routes/Contact");

// Database & Cloudinary Configurations
require("./config/database").connect();
require("./config/cloudinary").cloudinaryConnect();

// Set Port
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json()); // Body parser for JSON
app.use(cookieParser()); // Cookie parser middleware

// CORS (Cross-Origin Resource Sharing) Settings
app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend origin
    credentials: true, // Allow sending cookies from client
  })
);

// File Upload Middleware
app.use(
  fileUpload({
    useTempFiles: true, // Use temporary files
    tempFileDir: "/tmp", // Directory for temporary files
  })
);

// Routes Middleware
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactRoutes);

// Default Route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Server is active and running ...",
  });
});

// Test Route
app.get("/test", (req, res) => {
  res.send("Test route is working");
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running at port ${port} ...`);
});
