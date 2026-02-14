import { Request, Response } from "express";
import { getDocumentForCloning, cloneDocumentInDb } from "../services/documentCloneService";

/**
 * Clones an existing document for the authenticated user.
 *
 * @remarks
 * This controller:
 * - extracts the authenticated user's ID from `req.user`
 * - retrieves the original document using `getDocumentForCloning`
 * - validates that the document exists and is accessible
 * - creates a cloned copy using `cloneDocumentInDb`
 * - returns the cloned document with HTTP 201
 *
 * Error handling:
 * - Returns 404 if the original document cannot be found
 * - Logs unexpected errors and returns a generic 500 response
 *
 * This endpoint is typically used when a user wants to duplicate an
 * existing document to create a new version or template.
 *
 * @param req - Express request object containing user and document ID.
 * @param res - Express response object used to send the result.
 *
 * @returns A JSON response containing the cloned document or an error message.
 */
export const cloneDocument = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const docId = req.params.id;

    const original = await getDocumentForCloning(docId as string, userId);
    if (!original) {
      return res.status(404).json({ message: "Document not found" });
    }

    const clone = await cloneDocumentInDb(original, userId);

    return res.status(201).json(clone);

  } catch (err) {
    console.error("Clone error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
