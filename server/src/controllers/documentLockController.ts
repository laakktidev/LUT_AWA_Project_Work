import { Request, Response } from "express";
import {
  getDocumentForLocking,
  lockDocumentInDb,
  unlockDocumentInDb
} from "../services/documentLockService";


// LOCK DOCUMENT
export const lockDocument = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user._id;
  const docId = req.params.id;

  const doc = await getDocumentForLocking(docId as string);
  if (!doc) return res.status(404).json({ message: "Document not found" });

  if (doc.lock.isLocked && doc.lock.lockedBy?.toString() !== userId) {
    return res.status(423).json({ message: "Document is locked by another user" });
  }

  await lockDocumentInDb(docId as string, userId);

  res.json({ message: "Document locked" });
};


// UNLOCK DOCUMENT
export const unlockDocument = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user._id;
  const docId = req.params.id;

  const doc = await getDocumentForLocking(docId as string);
  if (!doc) return res.status(404).json({ message: "Document not found" });

  if (doc.lock.lockedBy?.toString() !== userId) {
    return res.status(403).json({ message: "You do not own the lock" });
  }

  await unlockDocumentInDb(docId as string);

  res.json({ message: "Document unlocked" });
};
