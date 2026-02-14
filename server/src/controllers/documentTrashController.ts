import { Request, Response } from "express";
import path from "path";
import { extractImageUrls, safeDelete } from "../utils/fileCleanup";
import {
  getTrashDocuments,
  getTrashCount,
  softDeleteDocumentById,
  restoreDocumentById,
  getAllDeletedDocuments,
  permanentlyDeleteDocuments
} from "../services/documentTrashService";

/* =======================================================
   GET ALL DOCUMENTS IN TRASH
   ------------------------------------------------------- */
/**
 * Retrieves all soft‑deleted documents belonging to the authenticated user.
 *
 * @remarks
 * This controller returns only documents marked as deleted (trash),
 * without permanently removing anything.
 *
 * @param req - Express request containing authenticated user info.
 * @param res - Express response returning the list of trashed documents.
 *
 * @returns A JSON array of trashed documents.
 */
export const getTrash = async (req: Request, res: Response) => {
  try {
    const docs = await getTrashDocuments(req.user!._id);
    return res.json(docs);
  } catch (err) {
    console.error("Error fetching trash:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =======================================================
   COUNT TRASH ITEMS
   ------------------------------------------------------- */
/**
 * Returns the number of documents currently in the user's trash.
 *
 * @param req - Express request containing authenticated user info.
 * @param res - Express response returning the count.
 *
 * @returns A JSON object containing `{ count: number }`.
 */
export const getTrashCountController = async (req: Request, res: Response) => {
  try {
    const count = await getTrashCount(req.user!._id);
    return res.json({ count });
  } catch (err) {
    console.error("Error counting trash:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =======================================================
   SOFT DELETE DOCUMENT
   ------------------------------------------------------- */
/**
 * Moves a document to the trash (soft delete).
 *
 * @remarks
 * This does **not** remove the document or its images from disk.
 * It simply marks the document as deleted so it can be restored later.
 *
 * @param req - Express request containing the document ID.
 * @param res - Express response confirming the soft delete.
 *
 * @returns A JSON message and the soft‑deleted document.
 */
export const softDeleteDocument = async (req: Request, res: Response) => {
  try {
    const doc = await softDeleteDocumentById(req.params.id as string);
    if (!doc) return res.status(404).json({ message: "Not found" });

    return res.status(200).json({ message: "Moved to trash", doc });
  } catch (err) {
    console.error("Soft delete error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =======================================================
   RESTORE DOCUMENT
   ------------------------------------------------------- */
/**
 * Restores a previously soft‑deleted document.
 *
 * @param req - Express request containing the document ID.
 * @param res - Express response confirming the restoration.
 *
 * @returns A JSON message and the restored document.
 */
export const restoreDocument = async (req: Request, res: Response) => {
  try {
    const doc = await restoreDocumentById(req.params.id as string);
    if (!doc) return res.status(404).json({ message: "Not found" });

    return res.status(200).json({ message: "Restored", doc });
  } catch (err) {
    console.error("Restore error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =======================================================
   EMPTY TRASH (PERMANENT DELETE)
   ------------------------------------------------------- */
/**
 * Permanently deletes all documents in the user's trash,
 * including removing all associated image files from disk.
 *
 * @remarks
 * Steps performed:
 * 1. Load all soft‑deleted documents for the user  
 * 2. Extract image URLs from each document  
 * 3. Convert URLs to filesystem paths  
 * 4. Delete each image using `safeDelete`  
 * 5. Permanently delete all trashed documents from the database  
 *
 * This action **cannot be undone**.
 *
 * @param req - Express request containing authenticated user info.
 * @param res - Express response confirming the deletion.
 *
 * @returns A JSON message with the number of permanently deleted documents.
 */
export const emptyTrash = async (req: Request, res: Response) => {
  try {
    const docsToDelete = await getAllDeletedDocuments(req.user!._id);

    for (const doc of docsToDelete) {
      const imageUrls = extractImageUrls(doc.content);

      imageUrls.forEach((url) => {
        const relativePath = url.replace(/^https?:\/\/[^\/]+/, "");
        const filePath = path.join(process.cwd(), relativePath);
        safeDelete(filePath);
      });
    }

    const result = await permanentlyDeleteDocuments(req.user!._id);

    return res.status(200).json({
      message: "Trash emptied",
      deletedCount: result.deletedCount
    });

  } catch (err) {
    console.error("Error emptying trash:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
