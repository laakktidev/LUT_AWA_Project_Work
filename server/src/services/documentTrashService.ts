import { Document } from "../models/Document";

/**
 * Retrieves all soft‑deleted documents belonging to a user.
 *
 * @remarks
 * Results are sorted by `deletedAt` in descending order so the most
 * recently deleted items appear first.
 *
 * @param userId - The ID of the user whose trash is being viewed.
 *
 * @returns A list of deleted documents.
 */
export async function getTrashDocuments(userId: string) {
  return Document.find({
    userId,
    isDeleted: true
  }).sort({ deletedAt: -1 });
}

/**
 * Counts how many documents a user has in the trash.
 *
 * @param userId - The ID of the user.
 *
 * @returns The number of soft‑deleted documents.
 */
export async function getTrashCount(userId: string) {
  return Document.countDocuments({
    userId,
    isDeleted: true
  });
}

/**
 * Soft‑deletes a document by marking it as deleted.
 *
 * @remarks
 * This function:
 * - sets `isDeleted` to `true`
 * - sets `deletedAt` to the current timestamp
 *
 * The document remains recoverable until permanently deleted.
 *
 * @param id - The ID of the document to soft‑delete.
 *
 * @returns The updated document.
 */
export async function softDeleteDocumentById(id: string) {
  return Document.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
}

/**
 * Restores a previously soft‑deleted document.
 *
 * @remarks
 * This function:
 * - sets `isDeleted` to `false`
 * - clears `deletedAt`
 *
 * @param id - The ID of the document to restore.
 *
 * @returns The restored document.
 */
export async function restoreDocumentById(id: string) {
  return Document.findByIdAndUpdate(
    id,
    { isDeleted: false, deletedAt: null },
    { new: true }
  );
}

/**
 * Retrieves all soft‑deleted documents for a user.
 *
 * @remarks
 * Used when emptying the trash to determine which documents
 * should be permanently removed.
 *
 * @param userId - The ID of the user.
 *
 * @returns A list of deleted documents.
 */
export async function getAllDeletedDocuments(userId: string) {
  return Document.find({
    userId,
    isDeleted: true
  });
}

/**
 * Permanently deletes all soft‑deleted documents for a user.
 *
 * @remarks
 * This operation cannot be undone.
 *
 * @param userId - The ID of the user whose trash is being emptied.
 *
 * @returns The deletion result from MongoDB.
 */
export async function permanentlyDeleteDocuments(userId: string) {
  return Document.deleteMany({
    userId,
    isDeleted: true
  });
}

/**
 * Permanently deletes a single document by ID.
 *
 * @remarks
 * This is a hard delete and cannot be undone.
 *
 * @param id - The ID of the document to permanently delete.
 *
 * @returns The deleted document, or `null` if not found.
 */
export async function permanentlyDeleteDocumentById(id: string) {
  return Document.findByIdAndDelete(id);
}
