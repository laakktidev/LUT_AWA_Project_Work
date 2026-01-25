import { Request, Response } from "express";
import { updateUserProfilePicture } from "../services/userProfileService";

export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = "/" + req.file.path.replace(/\\/g, "/");

    await updateUserProfilePicture(req.user!._id, filePath);

    return res.json({ success: true, path: filePath });

  } catch (err) {
    console.error("Profile picture upload error:", err);
    return res.status(500).json({ message: "Upload failed" });
  }
};
