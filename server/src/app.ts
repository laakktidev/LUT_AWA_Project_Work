import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import userRouter from "./routes/userRouter";
import documentRouter from "./routes/documentRouter";
import documentLockRoutes from "./routes/documentLock";
import documentPublicRouter from "./routes/documentPublic";
import shareRouter from "./routes/shareRouter";
import presentationRouter from "./routes/presentationRouter";

/**
 * Express application instance.
 *
 * @remarks
 * This module configures the core backend application:
 *
 * - Global middleware (CORS, logging, JSON parsing)
 * - Health check endpoint
 * - API route groups (users, documents, sharing, presentations)
 * - Static file serving for uploaded assets
 *
 * It acts as the central routing and middleware hub of the backend.
 */
export const app: Express = express();

/* =======================================================
   GLOBAL MIDDLEWARE
   ======================================================= */

/**
 * HTTP request logger middleware.
 */
app.use(morgan("dev"));

/**
 * CORS configuration middleware.
 *
 * @remarks
 * Allows cross-origin requests from the frontend application.
 */
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  })
);

/**
 * JSON body parser middleware.
 */
app.use(express.json());

/**
 * URL-encoded body parser middleware.
 */
app.use(express.urlencoded({ extended: false }));

/* =======================================================
   HEALTH CHECK
   ======================================================= */

/**
 * Health check endpoint.
 *
 * @remarks
 * Useful for:
 * - Deployment verification
 * - Uptime monitoring
 * - Connectivity testing
 */
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running!" });
});

/* =======================================================
   API ROUTES
   ======================================================= */

/**
 * User authentication & profile routes.
 */
app.use("/api/user", userRouter);

/**
 * Document CRUD, sharing, visibility, and image upload routes.
 */
app.use("/api/document", documentRouter);

/**
 * Document locking routes (prevents concurrent editing conflicts).
 */
app.use("/api/documentLock", documentLockRoutes);

/**
 * Public document access routes (no authentication required).
 */
app.use("/public", documentPublicRouter);

/**
 * Email sharing routes (public link sharing, editor invitations).
 */
app.use("/api/share", shareRouter);

/**
 * Presentation CRUD and collaboration routes.
 */
app.use("/api/presentation", presentationRouter);

// =======================================================
// DEVELOPMENT / TEST DATA ROUTES (TEMPORARY)
// =======================================================

if (process.env.NODE_ENV !== "production") {
  const seedUsersRouter = require("./dev/seedUsers").default;
  app.use("/dev", seedUsersRouter);
}



/* =======================================================
   STATIC FILE SERVING
   ======================================================= */

/**
 * Static file serving for uploaded images and files.
 */
app.use("/uploads", express.static("uploads"));



export default app;
