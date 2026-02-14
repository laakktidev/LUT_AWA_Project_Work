import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRouter from "./routes/user";
import documentRouter from "./routes/documentRouter";
import documentLockRoutes from "./routes/documentLock";
import documentPublicRouter from "./routes/documentPublic";
import shareRouter from "./routes/shareRouter";
import presentationRouter from "./routes/presentationRouter";

const app = express();

/**
 * Express application instance.
 *
 * @remarks
 * This file configures:
 * - global middleware (CORS, logging, JSON parsing)
 * - public health check route
 * - all API route groups (users, documents, presentations, sharing, etc.)
 * - static file serving for uploaded assets
 *
 * It acts as the central hub for all backend routing and middleware.
 */

// Logging middleware
app.use(morgan("dev"));

// CORS configuration
app.use(cors({ origin: process.env.APP_URL, credentials: true }));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Health check endpoint.
 *
 * @remarks
 * Useful for uptime monitoring, deployment checks, and verifying that
 * the server is reachable.
 */
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

/* =======================================================
   API ROUTES
   ------------------------------------------------------- */

/**
 * User authentication & profile routes.
 */
app.use("/api/user", userRouter);

/**
 * Document CRUD, sharing, visibility, and image upload routes.
 */
app.use("/api/document", documentRouter);

/**
 * Document locking routes (prevent concurrent editing).
 */
app.use("/api/documentLock", documentLockRoutes);

/**
 * Public document access routes (no authentication required).
 */
app.use("/public", documentPublicRouter);

/**
 * Email sharing routes (public link, editor invites, etc.).
 */
app.use("/api/share", shareRouter);

/**
 * Presentation CRUD and collaboration routes.
 */
app.use("/api/presentation", presentationRouter);

/**
 * Static file serving for uploaded images/files.
 */
app.use("/uploads", express.static("uploads"));

export default app;
