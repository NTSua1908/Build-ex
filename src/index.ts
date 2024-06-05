import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import corsOptions from "./config/cors.config";
import connectDatabase from "./config/database.config";
import configRoutes from "./config/router.config";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT ?? 3001;

// Middleware for parsing application/json
app.use(bodyParser.json());

// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

configRoutes(app);

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
