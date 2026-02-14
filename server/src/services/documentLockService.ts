import mongoose from "mongoose";
import { Document } from "../models/Document";

/**
 * Retrieves a document for lock or unlock operations.
 *
 * @remarks
 * This function does not enforce permissions — it simply loads the
 * document by ID. Permission checks are handled at the controller level.
 *
 * @param docId - The ID of the document to fetch.
 *
 * @returns The document if found, otherwise `null`.
 */
export async function getDocumentForLocking(docId: string) {
  return Document.findById(docId);
}

/**
 * Applies an edit lock to a document.
 *
 * @remarks
 * This function:
 * - sets `isLocked` to `true`
 * - assigns `lockedBy` to the user requesting the lock
 *
 * Locking prevents other users from editing the document simultaneously.
 * The controller ensures that only one user can lock at a time.
 *
 * @param docId - The ID of the document to lock.
 * @param userId - The ID of the user acquiring the lock.
 *
 * @returns The updated document with the new lock state.
 */
export async function lockDocumentInDb(docId: string, userId: string) {
  return Document.findByIdAndUpdate(
    docId,
    {
      lock: {
        isLocked: true,
        lockedBy: new mongoose.Types.ObjectId(userId)
      }
    },
    { new: true }
  );
}

/**
 * Removes the edit lock from a document.
 *
 * @remarks
 * This function:
 * - sets `isLocked` to `false`
 * - clears `lockedBy`
 *
 * The controller ensures that only the lock owner can unlock the document.
 *
 * @param docId - The ID of the document to unlock.
 *
 * @returns The updated document with lock removed.
 */
export async function unlockDocumentInDb(docId: string) {
  return Document.findByIdAndUpdate(
    docId,
    {
      lock: {
        isLocked: false,
        lockedBy: null
      }
    },
    { new: true }
  );
}
