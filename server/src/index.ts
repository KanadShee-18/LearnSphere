// Import Dependencies
import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";

import { CONFIGS } from "./config/index.js";

import { connect } from "./config/database.js";
import { cloudinaryConnect } from "./config/cloudinary.js";
import { connectDrive } from "./config/drive.js";

import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swagger-output.json" with {type: "json"};

// Create Express App
const app = express();

// Import Routes
import userRoutes from "./routes/User.js";
import profileRoutes from "./routes/Profile.js";
import paymentRoutes from "./routes/Payments.js";
import courseRoutes from "./routes/Course.js";
import contactRoutes from "./routes/Contact.js";

connect();
cloudinaryConnect();
connectDrive();

const port = CONFIGS.port_no || 4000;

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
app.use("/api/v2", userRoutes);
app.use("/api/v2", profileRoutes);
app.use("/api/v2", courseRoutes);
app.use("/api/v2", paymentRoutes);
app.use("/api/v2", contactRoutes);

// Default Route
app.get("/", (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "Server is active and running ...",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Test Route
app.get("/test", (req: Request, res: Response) => {
  res.send("Test route is working");
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running at port ${port} ...`);
  console.log(`[API Docs] >> available at: [http://localhost:${port}/api-docs]`)
});
