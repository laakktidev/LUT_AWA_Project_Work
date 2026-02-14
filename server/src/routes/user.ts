import { Router } from "express";
import { authenticateUser } from "../middleware/validateToken";
import { upload } from "../middleware/upload";

import { registerUser, loginUser } from "../controllers/userAuthController";
import { uploadProfilePicture } from "../controllers/userProfileController";
import { listUsers } from "../controllers/userListController";

import { registerValidation, loginValidation } from "../middleware/inputValidation";

const router = Router();

/* -----------------------------
   Authentication
------------------------------*/

/**
 * POST /register
 *
 * Registers a new user.
 *
 * @remarks
 * - Uses validation middleware to ensure proper input.
 * - The controller handles hashing, saving, and duplicate checks.
 *
 * @route POST /users/register
 */
router.post("/register", registerValidation, registerUser);

/**
 * POST /login
 *
 * Authenticates a user and returns a JWT token.
 *
 * @remarks
 * - Uses validation middleware to ensure proper input.
 * - The controller handles password verification and token creation.
 *
 * @route POST /users/login
 */
router.post("/login", loginValidation, loginUser);

/* -----------------------------
   Profile Picture Upload
------------------------------*/

/**
 * POST /profile-picture
 *
 * Uploads and updates the authenticated user's profile picture.
 *
 * @remarks
 * - Requires authentication.
 * - Uses Multer middleware to handle file uploads.
 * - The controller updates the user's profilePicture field.
 *
 * @route POST /users/profile-picture
 */
router.post(
  "/profile-picture",
  authenticateUser,
  upload.single("image"),
  uploadProfilePicture
);

/* -----------------------------
   User Listing
------------------------------*/

/**
 * GET /
 *
 * Retrieves a list of all users with safe, public-facing fields.
 *
 * @remarks
 * - Requires authentication.
 * - Useful for sharing dialogs, autocomplete, and collaboration features.
 *
 * @route GET /users
 */
router.get("/", authenticateUser, listUsers);

export default router;
