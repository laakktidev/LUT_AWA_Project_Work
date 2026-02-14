import { Request, Response } from "express";
import { getPublicDocumentById } from "../services/documentPublicService";

/**
 * Retrieves a publicly accessible document by its ID.
 *
 * @remarks
 * This controller:
 * - loads the document using `getPublicDocumentById`
 * - verifies that the document exists
 * - checks that the document is marked as public
 * - returns the document content if accessible
 *
 * This endpoint does **not** require authentication and is intended for
 * public sharing links or embedded previews.
 *
 * @param req - Express request containing the document ID.
 * @param res - Express response returning the public document or an error.
 *
 * @returns A JSON response with the document or an appropriate error message.
 */
export const getPublicDocument = async (req: Request, res: Response) => {
  try {
    const doc = await getPublicDocumentById(req.params.id as string);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!doc.isPublic) {
      return res.status(403).json({ message: "This document is not public" });
    }

    return res.json(doc);

  } catch (err) {
    console.error("Error fetching public document:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
