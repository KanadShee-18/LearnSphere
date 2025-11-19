import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Learnsphere Backend",
    description: "API documentation for Learnsphere Backend",
    version: "1.0.0",
  },
  host: "learnsphere-backend-qiwn.onrender.com/api/v2",
  schemes: ["https"],
};

const outputFile = "./swagger-output.json";
const routes = [
  "./src/routes/user.route.ts",
  "./src/routes/course.route.ts",
  "./src/routes/payment.route.ts",
  "./src/routes/contact.route.ts",
  "./src/routes/payment.route.ts",
];

swaggerAutogen()(outputFile, routes, doc);
