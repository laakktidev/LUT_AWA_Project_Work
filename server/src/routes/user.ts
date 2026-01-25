import { Router } from "express";
import { authenticateUser } from "../middleware/validateToken";
import { upload } from "../middleware/upload";

import { registerUser, loginUser } from "../controllers/userAuthController";
import { uploadProfilePicture } from "../controllers/userProfileController";
import { listUsers } from "../controllers/userListController";

import { registerValidation, loginValidation } from "../middleware/inputValidation";

const router = Router();

// AUTH
router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);

// PROFILE PICTURE
router.post(
  "/profile-picture",
  authenticateUser,
  upload.single("image"),
  uploadProfilePicture
);

// LIST USERS
router.get("/", authenticateUser, listUsers);

export default router;
