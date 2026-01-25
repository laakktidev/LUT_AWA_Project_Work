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


// GET ALL DOCUMENTS IN TRASH
export const getTrash = async (req: Request, res: Response) => {
  try {
    const docs = await getTrashDocuments(req.user!._id);
    return res.json(docs);
  } catch (err) {
    console.error("Error fetching trash:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// COUNT TRASH ITEMS
export const getTrashCountController = async (req: Request, res: Response) => {
  try {
    const count = await getTrashCount(req.user!._id);
    return res.json({ count });
  } catch (err) {
    console.error("Error counting trash:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// SOFT DELETE DOCUMENT
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


// RESTORE DOCUMENT
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


// EMPTY TRASH (permanently delete + remove images)
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
