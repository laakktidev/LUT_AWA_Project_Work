import { Request, Response } from "express";
import {
  addEditorsToDocument,
  updatePublicVisibilityInDb,
  getDocumentForSharing
} from "../services/documentShareService";


// ADD EDITORS
export const updateEditors = async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds)) {
      return res.status(400).json({ message: "userIds must be an array" });
    }

    const doc = await getDocumentForSharing(req.params.id as string, req.user!._id);
    if (!doc) {
      return res.status(403).json({ message: "Not allowed to modify editors" });
    }

    await addEditorsToDocument(req.params.id as string, userIds);

    return res.status(200).json({ message: "Editors updated" });

  } catch (err) {
    console.error("Error updating editors:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// UPDATE PUBLIC VISIBILITY
export const updatePublicVisibility = async (req: Request, res: Response) => {
  try {
    const { isPublic } = req.body;

    if (typeof isPublic !== "boolean") {
      return res.status(400).json({ message: "isPublic must be boolean" });
    }

    const updated = await updatePublicVisibilityInDb(
      req.params.id as string,
      req.user!._id,
      isPublic
    );

    if (!updated) {
      return res.status(403).json({ message: "Only the owner can change visibility" });
    }

    return res.json({ message: "Visibility updated", isPublic });

  } catch (err) {
    console.error("Error updating public status:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
