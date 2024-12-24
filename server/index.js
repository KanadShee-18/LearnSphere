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

require("./config/database").connect();
require("./config/cloudinary").cloudinaryConnect();
require("./config/drive").connectDrive();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://learn-sphere-edui.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "CORS policy does not allow access from this origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization,Accept",
    optionsSuccessStatus: 204,
    credentials: true,
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
