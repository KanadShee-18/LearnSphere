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
require("./config/drive").connectDrive();

// Set Port
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS (Cross-Origin Resource Sharing) Settings
const allowedOrigins = [
  "http://localhost:5173",
  "https://learn-sphere-edui.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow non-web clients like Postman
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "CORS policy does not allow access from this origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization", // Adjust to fit your needs
    optionsSuccessStatus: 204, // For legacy browsers
  })
);

// File Upload Middleware
app.use(
  fileUpload({
    useTempFiles: false,
    // tempFileDir: "/tmp",
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
