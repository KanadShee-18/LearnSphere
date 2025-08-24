import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";
dotenv.config();

const doc = {
  info: {
    title: "Server APIs",
    description: "Automatically generated swagger docs for testing APIs",
    version: "1.1.0",
  },
  host:
    process.env.NODE_ENV === "development"
      ? "localhost:4000"
      : `${process.env.SERVER_URL}`,
  basePath: "/api/v2",
  schemes: [process.env.NODE_ENV === "development" ? "http" : "https"],
};

const outputFile = "./swagger-output.json";

const endPointFiles = [
  "./routes/Contact.ts",
  "./routes/Course.ts",
  "./routes/Profile.ts",
  "./routes/User.ts",
];

swaggerAutogen()(outputFile, endPointFiles, doc);
