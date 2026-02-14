import { Request, Response } from "express";
import {
  getDocumentForLocking,
  lockDocumentInDb,
  unlockDocumentInDb
} from "../services/documentLockService";

/* =======================================================
   LOCK DOCUMENT
   ------------------------------------------------------- */
/**
 * Locks a document for exclusive editing by the authenticated user.
 *
 * @remarks
 * This controller:
 * - ensures the user is authenticated
 * - loads the document using `getDocumentForLocking`
 * - checks whether the document is already locked by another user
 * - applies the lock using `lockDocumentInDb`
 *
 * If the document is already locked by someone else, a `423 Locked`
 * response is returned.
 *
 * @param req - Express request containing user info and document ID.
 * @param res - Express response returning lock status.
 *
 * @returns A JSON message confirming the lock or an error response.
 */
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

/* =======================================================
   UNLOCK DOCUMENT
   ------------------------------------------------------- */
/**
 * Unlocks a document previously locked by the authenticated user.
 *
 * @remarks
 * This controller:
 * - ensures the user is authenticated
 * - loads the document using `getDocumentForLocking`
 * - verifies that the current user owns the lock
 * - removes the lock using `unlockDocumentInDb`
 *
 * If the user does not own the lock, a `403 Forbidden` response is returned.
 *
 * @param req - Express request containing user info and document ID.
 * @param res - Express response confirming unlock status.
 *
 * @returns A JSON message confirming the unlock or an error response.
 */
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
