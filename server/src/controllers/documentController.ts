import { Request, Response } from "express";
import path from "path";
import { extractImageUrls, safeDelete } from "../utils/fileCleanup";
import {
  createDocumentInDb,
  getAllDocumentsForUser,
  getDocumentById,
  updateDocumentById,
  deleteDocumentById
} from "../services/documentService";

/* =======================================================
   CREATE DOCUMENT
   ------------------------------------------------------- */
/**
 * Creates a new document for the authenticated user.
 *
 * @remarks
 * Validates that a title is provided, then delegates creation to the
 * database service. Returns the newly created document in a normalized
 * response format.
 *
 * @param req - Express request containing `title` and `content`.
 * @param res - Express response used to send the created document.
 *
 * @returns A JSON response with the new document or an error message.
 */
export const createDocument = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newDoc = await createDocumentInDb({
      userId: req.user!._id,
      title,
      content: content || ""
    });

    return res.status(201).json({
      id: newDoc._id.toString(),
      title: newDoc.title,
      content: newDoc.content,
      userId: newDoc.userId.toString()
    });

  } catch (err) {
    console.error("Error creating document:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =======================================================
   GET ALL DOCUMENTS
   ------------------------------------------------------- */
/**
 * Retrieves all documents owned by or shared with the authenticated user.
 *
 * @param req - Express request containing authenticated user info.
 * @param res - Express response returning the list of documents.
 *
 * @returns A JSON array of documents.
 */
export const getDocuments = async (req: Request, res: Response) => {
  try {
    const docs = await getAllDocumentsForUser(req.user!._id);
    return res.json(docs);
  } catch (err) {
    console.error("Error fetching documents:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =======================================================
   GET SINGLE DOCUMENT
   ------------------------------------------------------- */
/**
 * Retrieves a single document by ID with permission checks.
 *
 * @remarks
 * Access is granted if:
 * - the user is the owner
 * - the user is an editor
 * - the document is public
 *
 * If the document is locked by another user, a `lockWarning` is included.
 *
 * @param req - Express request containing document ID and user info.
 * @param res - Express response returning the document or an error.
 *
 * @returns The document, optionally with a lock warning.
 */
export const getDocument = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const doc = await getDocumentById(req.params.id as string);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const isOwner = doc.userId.toString() === userId;
    const isEditor = doc.editors.some(e => e.toString() === userId);
    const isPublic = doc.isPublic === true;

    if (!isOwner && !isEditor && !isPublic) {
      return res.status(403).json({ message: "No permission to view this document" });
    }

    if (doc.lock.isLocked && doc.lock.lockedBy?.toString() !== userId) {
      return res.status(200).json({
        ...doc.toObject(),
        lockWarning: "Document is locked by another user"
      });
    }

    return res.json(doc);

  } catch (err) {
    console.error("Error fetching document:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =======================================================
   UPDATE DOCUMENT
   ------------------------------------------------------- */
/**
 * Updates a document's title and content.
 *
 * @remarks
 * This controller:
 * - loads the existing document
 * - extracts image URLs from old and new content
 * - deletes removed images from disk
 * - updates the document in the database
 *
 * @param req - Express request containing updated fields.
 * @param res - Express response returning the updated document.
 *
 * @returns The updated document or an error message.
 */
export const updateDocument = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { title, content: newContent } = req.body;

    const oldDoc = await getDocumentById(id as string);
    if (!oldDoc) {
      return res.status(404).json({ error: "Document not found" });
    }

    const oldContent = oldDoc.content || "";

    const oldImages = extractImageUrls(oldContent);
    const newImages = extractImageUrls(newContent);

    const removedImages = oldImages.filter((url) => !newImages.includes(url));

    for (const url of removedImages) {
      const filePath = path.join(
        process.cwd(),
        "uploads",
        "documents",
        path.basename(url)
      );
      safeDelete(filePath);
    }

    const updated = await updateDocumentById(id as string, { title, content: newContent });

    res.json(updated);
  } catch (err) {
    console.error("PUT /documents/:id failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* =======================================================
   DELETE DOCUMENT
   ------------------------------------------------------- */
/**
 * Deletes a document and all associated images.
 *
 * @remarks
 * Steps:
 * - load the document
 * - extract image URLs from its content
 * - delete each image file from disk
 * - delete the document from the database
 *
 * @param req - Express request containing document ID.
 * @param res - Express response confirming deletion.
 *
 * @returns A success message or an error.
 */
export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const docId = req.params.id;

    const document = await getDocumentById(docId as string);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const imageUrls = extractImageUrls(document.content);

    imageUrls.forEach((url) => {
      const relativePath = url.replace(/^https?:\/\/[^\/]+/, "");
      const filePath = path.join(process.cwd(), relativePath);
      safeDelete(filePath);
    });

    await deleteDocumentById(docId as string);

    res.json({ message: "Document and images deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
