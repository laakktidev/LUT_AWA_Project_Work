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

/* -----------------------------
   CREATE
------------------------------*/
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

/* -----------------------------
   GET ALL
------------------------------*/
export const getPresentations = async (req: Request, res: Response) => {
  try {
    
    const pres = await getAllPresentationsForUser(req.user!._id.toString());
    return res.json(pres);
  } catch (err) {
    console.error("Error fetching presentations:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------
   GET ONE
------------------------------*/
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

/* -----------------------------
   UPDATE
------------------------------*/
export const updatePresentation = async (req: Request, res: Response) => {
  try {
    const updated = await updatePresentationById(req.params.id as string, req.body);
    return res.json(updated);
  } catch (err) {
    console.error("Error updating presentation:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------
   DELETE (hard delete)
------------------------------*/
export const deletePresentation = async (req: Request, res: Response) => {
  try {
    await deletePresentationById(req.params.id as string);
    return res.json({ message: "Presentation deleted" });
  } catch (err) {
    console.error("Error deleting presentation:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------
   SEARCH
------------------------------*/
export const searchPresentations = async (req: Request, res: Response) => {
  try {
    const search = (req.query.q as string) || "";
    const userId = req.user!._id;

    const results = await searchPresentationsInDb(userId, search);

    // Convert to unified item format
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

/* -----------------------------
   LOCK / UNLOCK
------------------------------*/
export const lockPres = async (req: Request, res: Response) => {
  try {
    const updated = await lockPresentation(req.params.id as string, req.user!._id.toString());
    return res.json(updated);
  } catch (err) {
    console.error("Error locking presentation:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const unlockPres = async (req: Request, res: Response) => {
  try {
    const updated = await unlockPresentation(req.params.id as string);
    return res.json(updated);
  } catch (err) {
    console.error("Error unlocking presentation:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

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