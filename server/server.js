import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import "dotenv/config";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import connectDB from "./configs/db.js";
import getSwaggerOptions from "./swagger/swaggerOptions.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();
const port = 3000;

await connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());
app.use("/api/inngest", serve({ client: inngest, functions }));

const openapiSpecification = swaggerJsdoc(getSwaggerOptions(port));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// API Routes
app.get("/", (req, res) => {
  res.send("Server is Live!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
