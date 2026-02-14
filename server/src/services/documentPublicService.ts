import { Document } from "../models/Document";

/**
 * Retrieves a document by its ID, regardless of visibility.
 *
 * @remarks
 * This function does **not** enforce:
 * - public visibility (`isPublic`)
 * - ownership
 * - editor permissions
 *
 * Those checks are performed in the controller layer.
 *
 * This service simply loads the document from MongoDB so the controller
 * can decide whether the requester is allowed to view it.
 *
 * @param id - The ID of the document to fetch.
 *
 * @returns The document if found, otherwise `null`.
 */
export async function getPublicDocumentById(id: string) {
  return Document.findById(id);
}
