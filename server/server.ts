import app from "./src/app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Entry point for the backend server.
 *
 * @remarks
 * This file:
 * - Loads environment variables
 * - Connects to MongoDB using Mongoose
 * - Starts the Express application
 *
 * It is the top-level bootstrap for the entire backend.
 */

// Resolve configuration values
const port = parseInt(process.env.PORT as string) || 1234;
const MONGO_URL = process.env.MONGO_URL as string;

// Establish MongoDB connection
mongoose.connect(MONGO_URL);

/**
 * MongoDB connection event listener.
 *
 * @remarks
 * Logs a message when the database connection is successfully established.
 */
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB:", mongoose.connection.name);
});

/**
 * Starts the Express server.
 *
 * @remarks
 * Once running, the server listens for incoming HTTP requests on the
 * configured port. All routing and middleware logic is defined in `src/app.ts`.
 */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
