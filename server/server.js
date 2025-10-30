import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { serve } from "inngest/express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import connectDB from "./configs/db.js";
import { functions, inngest } from "./inngest/index.js";
import adminRouter from "./routes/adminRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import showRouter from "./routes/showRoutes.js";
import userRouter from "./routes/userRoutes.js";
import getSwaggerOptions from "./swagger/swaggerOptions.js";
import { stripeWebhooks } from "./utils/stripeWebhooks.js";

const app = express();
const port = 3000;

await connectDB();

// Stripe Webhooks Route
app.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

const openapiSpecification = swaggerJsdoc(getSwaggerOptions(port));

// API Routes
app.get("/", (req, res) => {
  res.send("Server is Live!");
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.get("/test", async (req, res) => {});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
