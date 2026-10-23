import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

const docsApp = express();

docsApp.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default docsApp;
