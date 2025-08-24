import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Server APIs",
    description: "Automatically generated swagger docs for testing APIs",
    version: "1.1.0",
  },
  host: "localhost:4000",
  basePath: "/api/v2",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";

const endPointFiles = [
  "./routes/Contact.ts",
  "./routes/Course.ts",
  "./routes/Profile.ts",
  "./routes/User.ts",
];

swaggerAutogen()(outputFile, endPointFiles, doc);
