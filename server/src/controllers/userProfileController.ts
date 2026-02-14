import { Request, Response } from "express";
import { updateUserProfilePicture } from "../services/userProfileService";

/**
 * Handles uploading and saving a user's profile picture.
 *
 * @remarks
 * This controller:
 * - expects a file uploaded via Multer (`req.file`)
 * - normalizes the file path for cross‑platform compatibility
 * - updates the user's profile picture path in the database
 * - returns the public path to the uploaded image
 *
 * The actual file storage is handled by Multer's configuration.
 *
 * @param req - Express request containing the uploaded file and user info.
 * @param res - Express response returning the saved file path.
 *
 * @returns A JSON object with `{ success: true, path }` or an error message.
 */
export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Normalize Windows backslashes → forward slashes
    const filePath = "/" + req.file.path.replace(/\\/g, "/");

    await updateUserProfilePicture(req.user!._id, filePath);

    return res.json({ success: true, path: filePath });

  } catch (err) {
    console.error("Profile picture upload error:", err);
    return res.status(500).json({ message: "Upload failed" });
  }
};
