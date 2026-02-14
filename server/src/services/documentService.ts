import { Document } from "../models/Document";

/**
 * Creates a new document in the database.
 *
 * @remarks
 * This function simply forwards the provided data to Mongoose's `create`
 * method. Validation and defaults are handled by the schema.
 *
 * @param data - The document fields to create.
 *
 * @returns The newly created document.
 */
export async function createDocumentInDb(data: any) {
  return Document.create(data);
}

/**
 * Retrieves all documents that the user owns or can edit.
 *
 * @remarks
 * This function:
 * - excludes soft‑deleted documents (`isDeleted !== true`)
 * - returns both owned and shared documents
 * - sorts results by `updatedAt` descending
 *
 * @param userId - The ID of the user requesting the documents.
 *
 * @returns A list of accessible documents.
 */
export async function getAllDocumentsForUser(userId: string) {
  return Document.find({
    $or: [
      { userId },
      { editors: userId }
    ],
    isDeleted: { $ne: true }
  }).sort({ updatedAt: -1 });
}

/**
 * Retrieves a single document by its ID.
 *
 * @remarks
 * This function does not enforce permissions or visibility.
 * Those checks are performed in the controller layer.
 *
 * @param id - The ID of the document to retrieve.
 *
 * @returns The document if found, otherwise `null`.
 */
export async function getDocumentById(id: string) {
  return Document.findById(id);
}

/**
 * Updates a document by its ID.
 *
 * @remarks
 * This function:
 * - applies the provided update data
 * - returns the updated document (`new: true`)
 *
 * Permission checks are handled in the controller.
 *
 * @param id - The ID of the document to update.
 * @param data - The fields to update.
 *
 * @returns The updated document.
 */
export async function updateDocumentById(id: string, data: any) {
  return Document.findByIdAndUpdate(id, data, { new: true });
}

/**
 * Permanently deletes a document from the database.
 *
 * @remarks
 * This is a **hard delete**.  
 * Soft deletion is handled elsewhere using `isDeleted` and `deletedAt`.
 *
 * @param id - The ID of the document to delete.
 *
 * @returns The deleted document, or `null` if not found.
 */
export async function deleteDocumentById(id: string) {
  return Document.findByIdAndDelete(id);
}
