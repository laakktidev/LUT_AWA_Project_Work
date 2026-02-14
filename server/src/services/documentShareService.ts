import { Document } from "../models/Document";

/**
 * Retrieves a document for sharing operations, but only if the requester
 * is the owner of the document.
 *
 * @remarks
 * This function enforces strict ownership:
 * - Editors are NOT allowed to modify the editor list.
 * - Only the owner can update sharing settings.
 *
 * @param docId - The ID of the document to fetch.
 * @param userId - The ID of the user attempting to modify sharing settings.
 *
 * @returns The document if the user is the owner, otherwise `null`.
 */
export async function getDocumentForSharing(docId: string, userId: string) {
  return Document.findOne({
    _id: docId,
    userId
  });
}

/**
 * Adds one or more users to the document's editor list.
 *
 * @remarks
 * This function uses `$addToSet` with `$each` to:
 * - avoid duplicates
 * - add multiple editors in a single operation
 *
 * Permission checks (owner‑only) are handled in the controller.
 *
 * @param docId - The ID of the document to update.
 * @param userIds - Array of user IDs to add as editors.
 *
 * @returns The updated document.
 */
export async function addEditorsToDocument(docId: string, userIds: string[]) {
  return Document.findByIdAndUpdate(
    docId,
    { $addToSet: { editors: { $each: userIds } } },
    { new: true }
  );
}

/**
 * Updates the public visibility of a document.
 *
 * @remarks
 * This function:
 * - loads the document
 * - verifies that the requester is the owner
 * - updates the `isPublic` flag
 *
 * Editors cannot change public visibility.
 *
 * @param docId - The ID of the document to update.
 * @param userId - The ID of the user attempting the update.
 * @param isPublic - Whether the document should be public.
 *
 * @returns The updated document, or `null` if not found or not allowed.
 */
export async function updatePublicVisibilityInDb(
  docId: string,
  userId: string,
  isPublic: boolean
) {
  const doc = await Document.findById(docId);
  if (!doc) return null;

  const isOwner = doc.userId.toString() === userId.toString();
  if (!isOwner) return null;

  doc.isPublic = isPublic;
  await doc.save();

  return doc;
}
