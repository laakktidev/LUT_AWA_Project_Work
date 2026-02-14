import { Document } from "../models/Document";

/**
 * Retrieves a document for cloning, but only if the requesting user
 * is the owner of the document.
 *
 * @remarks
 * This function enforces ownership by checking:
 * - the document ID
 * - the user ID of the requester
 *
 * Editors are intentionally not allowed to clone documents.
 *
 * @param docId - The ID of the document to clone.
 * @param userId - The ID of the user attempting the clone.
 *
 * @returns The document if found and owned by the user, otherwise `null`.
 */
export async function getDocumentForCloning(docId: string, userId: string) {
  return Document.findOne({
    _id: docId,
    userId
  });
}

/**
 * Creates a new cloned document based on an existing one.
 *
 * @remarks
 * The clone:
 * - copies the title (with `" (Copy)"` appended)
 * - copies the content
 * - assigns ownership to the requesting user
 * - resets editors, public visibility, and deletion flags
 *
 * Lock state is intentionally not copied.
 *
 * @param original - The original document to clone.
 * @param userId - The ID of the user who will own the cloned document.
 *
 * @returns The newly created cloned document.
 */
export async function cloneDocumentInDb(original: any, userId: string) {
  const clone = new Document({
    title: original.title + " (Copy)",
    content: original.content,
    userId,
    editors: [],
    isPublic: false,
    isDeleted: false,
    deletedAt: null
  });

  await clone.save();
  return clone;
}
