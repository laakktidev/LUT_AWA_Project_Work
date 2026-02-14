// controllers/presentationController.ts
import { Request, Response } from "express";
import {
  createPresentationInDb,
  getAllPresentationsForUser,
  getPresentationById,
  updatePresentationById,
  deletePresentationById,
  searchPresentationsInDb,
  lockPresentation,
  unlockPresentation,
  addEditorsToPresentation,
  getPresentationForSharing
} from "../services/presentationService";

/* =======================================================
   CREATE PRESENTATION
   ------------------------------------------------------- */
/**
 * Creates a new presentation for the authenticated user.
 *
 * @remarks
 * This controller:
 * - validates that a title is provided
 * - accepts an optional `slides` array
 * - delegates creation to `createPresentationInDb`
 * - returns the newly created presentation
 *
 * @param req - Express request containing title and slides.
 * @param res - Express response returning the created presentation.
 */
export const createPresentation = async (req: Request, res: Response) => {
  try {
    const { title, slides } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newPres = await createPresentationInDb({
      userId: req.user!._id.toString(),
      title,
      slides: slides || [],
    });

    return res.status(201).json(newPres);
  } catch (err) {
    console.error("Error creating presentation:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =======================================================
   GET ALL PRESENTATIONS
   ------------------------------------------------------- */
/**
 * Retrieves all presentations owned by or shared with the authenticated user.
 *
 * @param req - Express request containing user info.
 * @param res - Express response returning the list of presentations.
 */
export const getPresentations = async (req: Request, res: Response) => {
  try {
    const pres = await getAllPresentationsForUser(req.user!._id.toString());
    return res.json(pres);
  } catch (err) {
    console.error("Error fetching presentations:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =======================================================
   GET SINGLE PRESENTATION
   ------------------------------------------------------- */
/**
 * Retrieves a single presentation with permission and lock checks.
 *
 * @remarks
 * Access is granted if:
 * - the user is the owner
 * - the user is an editor
 *
 * If the presentation is locked by another user, a `lockWarning` is included.
 *
 * @param req - Express request containing presentation ID and user info.
 * @param res - Express response returning the presentation or an error.
 */
export const getPresentation = async (req: Request, res: Response) => {
  try {
    console.log("Fetching presentation with ID:", req.params.id);
    const pres = await getPresentationById(req.params.id as string);

    if (!pres) {
      return res.status(404).json({ message: "Presentation not found" });
    }

    const userId = req.user!._id.toString();
    const isOwner = pres.userId.toString() === userId;
    const isEditor = pres.editors.some(e => e.toString() === userId);

    if (!isOwner && !isEditor) {
      return res.status(403).json({ message: "No permission to view this presentation" });
    }

    if (pres.lock.isLocked && pres.lock.lockedBy?.toString() !== userId) {
      return res.status(200).json({
        ...pres.toObject(),
        lockWarning: "Presentation is locked by another user",
      });
    }

    return res.json(pres);
  } catch (err) {
    console.error("Error fetching presentation:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =======================================================
   UPDATE PRESENTATION
   ------------------------------------------------------- */
/**
 * Updates a presentation's fields.
 *
 * @remarks
 * The request body may contain:
 * - title
 * - slides
 * - metadata
 *
 * All update logic is handled in the service layer.
 *
 * @param req - Express request containing update data.
 * @param res - Express response returning the updated presentation.
 */
export const updatePresentation = async (req: Request, res: Response) => {
  try {
    const updated = await updatePresentationById(req.params.id as string, req.body);
    return res.json(updated);
  } catch (err) {
    console.error("Error updating presentation:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =======================================================
   DELETE PRESENTATION (HARD DELETE)
   ------------------------------------------------------- */
/**
 * Permanently deletes a presentation.
 *
 * @remarks
 * Unlike documents, presentations do not have a trash system.
 *
 * @param req - Express request containing presentation ID.
 * @param res - Express response confirming deletion.
 */
export const deletePresentation = async (req: Request, res: Response) => {
  try {
    await deletePresentationById(req.params.id as string);
    return res.json({ message: "Presentation deleted" });
  } catch (err) {
    console.error("Error deleting presentation:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =======================================================
   SEARCH PRESENTATIONS
   ------------------------------------------------------- */
/**
 * Searches presentations belonging to the authenticated user.
 *
 * @remarks
 * Results are normalized into a unified "item" format so they can be
 * displayed alongside documents in a combined search UI.
 *
 * @param req - Express request containing search query.
 * @param res - Express response returning search results.
 */
export const searchPresentations = async (req: Request, res: Response) => {
  try {
    const search = (req.query.q as string) || "";
    const userId = req.user!._id;

    const results = await searchPresentationsInDb(userId, search);

    const items = results.map(p => ({
      _id: p._id.toString(),
      title: p.title,
      type: "presentation",
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));

    return res.json(items);

  } catch (err) {
    console.error("Error searching presentations:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =======================================================
   LOCK / UNLOCK PRESENTATION
   ------------------------------------------------------- */
/**
 * Locks a presentation for exclusive editing.
 *
 * @remarks
 * Only one user may edit a presentation at a time.
 *
 * @param req - Express request containing presentation ID.
 * @param res - Express response returning the updated lock state.
 */
export const lockPres = async (req: Request, res: Response) => {
  try {
    const updated = await lockPresentation(req.params.id as string, req.user!._id.toString());
    return res.json(updated);
  } catch (err) {
    console.error("Error locking presentation:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Unlocks a presentation previously locked by a user.
 *
 * @param req - Express request containing presentation ID.
 * @param res - Express response returning the updated lock state.
 */
export const unlockPres = async (req: Request, res: Response) => {
  try {
    const updated = await unlockPresentation(req.params.id as string);
    return res.json(updated);
  } catch (err) {
    console.error("Error unlocking presentation:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =======================================================
   UPDATE EDITORS
   ------------------------------------------------------- */
/**
 * Updates the list of editors for a presentation.
 *
 * @remarks
 * Only the owner may modify the editor list.
 *
 * @param req - Express request containing editor user IDs.
 * @param res - Express response confirming the update.
 */
export const updateEditors = async (req: Request, res: Response) => {
  console.log("Updating editors for presentation ID:", req.params.id);
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds)) {
      return res.status(400).json({ message: "userIds must be an array" });
    }

    const doc = await getPresentationForSharing(req.params.id as string, req.user!._id);
    if (!doc) {
      return res.status(403).json({ message: "Not allowed to modify editors" });
    }

    await addEditorsToPresentation(req.params.id as string, userIds);

    return res.status(200).json({ message: "Editors updated" });

  } catch (err) {
    console.error("Error updating editors:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
