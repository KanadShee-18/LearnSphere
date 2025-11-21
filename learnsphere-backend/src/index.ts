import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import fileUpload from "express-fileupload";

// configs
import { connectCloudinary } from "./configs/cloudinary.config.js";
import { dbConnect } from "./configs/db.config.js";
import { connectDrive } from "./configs/drive.config.js";
import { CONFIGS } from "./configs/index.js";

// swagger documentation
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger-output.json" with { type: "json" };

// Main application
const app: Application = express();

// Necessary Routes
import contactRoutes from "./routes/contact.route.js";
import courseRoutes from "./routes/course.route.js";
import paymentRoutes from "./routes/payment.route.js";
import profileRoutes from "./routes/profile.route.js";
import userRoutes from "./routes/user.route.js";
// import { errorHandler } from "./utils/error-handler.js";
import logger from "./configs/logger.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";

dbConnect();
connectCloudinary();
connectDrive();

const port = CONFIGS.port_no || 4000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5175",
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

// Swagger Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.get("/docs-json", (req: Request, res: Response) => {
  res.json(swaggerFile);
});


// Default Route
app.get("/", (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "Server is active and running ...",
  });
});

app.use(errorMiddleware);

// Start the Server
app.listen(port, () => {
  logger.info(`Server is running at port ${port} ...`);
  logger.info(`Swagger docs at http://localhost:${port}/docs`);
});
