import { Request, Response } from "express";
import {
  addEditorsToDocument,
  updatePublicVisibilityInDb,
  getDocumentForSharing
} from "../services/documentShareService";

/* =======================================================
   UPDATE EDITORS
   ------------------------------------------------------- */
/**
 * Updates the list of editors for a document.
 *
 * @remarks
 * This controller:
 * - validates that `userIds` is an array
 * - checks whether the authenticated user has permission to modify editors
 *   (typically only the owner)
 * - delegates the update to `addEditorsToDocument`
 *
 * If the user is not allowed to modify editors, a `403 Forbidden` response
 * is returned.
 *
 * @param req - Express request containing the document ID and new editor IDs.
 * @param res - Express response confirming the update or returning an error.
 *
 * @returns A JSON message indicating success or failure.
 */
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

/* =======================================================
   UPDATE PUBLIC VISIBILITY
   ------------------------------------------------------- */
/**
 * Updates the public visibility status of a document.
 *
 * @remarks
 * This controller:
 * - validates that `isPublic` is a boolean
 * - ensures the authenticated user is the owner
 * - updates the visibility using `updatePublicVisibilityInDb`
 *
 * If the user is not the owner, a `403 Forbidden` response is returned.
 *
 * @param req - Express request containing the document ID and visibility flag.
 * @param res - Express response confirming the update or returning an error.
 *
 * @returns A JSON message with the updated visibility state.
 */
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
