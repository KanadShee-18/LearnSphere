import swaggerAutogen from "swagger-autogen";
import { CONFIGS } from "./config/index.ts";

const doc = {
  info: {
    title: "Server APIs",
    description: "Automatically generated swagger docs for testing APIs",
    version: "1.1.0",
  },
  host:
    CONFIGS.node_environment === "development"
      ? "localhost:4000"
      : `${CONFIGS.server_url}`,
  basePath: "/api/v2",
  schemes: [CONFIGS.node_environment === "development" ? "http" : "https"],
};

const outputFile = "./swagger-output.json";

const endPointFiles = [
  "./routes/Contact.ts",
  "./routes/Course.ts",
  "./routes/Profile.ts",
  "./routes/User.ts",
];

swaggerAutogen()(outputFile, endPointFiles, doc);
