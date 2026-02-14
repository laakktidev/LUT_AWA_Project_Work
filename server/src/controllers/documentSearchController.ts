import { Request, Response } from "express";
import { searchDocumentsInDb } from "../services/documentSearchService";

/**
 * Searches documents belonging to the authenticated user.
 *
 * @remarks
 * This controller:
 * - extracts the search query from `req.query.q`
 * - retrieves the authenticated user's ID from `req.user`
 * - delegates the search logic to `searchDocumentsInDb`
 * - returns all matching documents
 *
 * The search implementation is handled entirely in the service layer,
 * allowing this controller to remain lightweight and focused on request flow.
 *
 * @param req - Express request containing the search query and user info.
 * @param res - Express response returning the search results.
 *
 * @returns A JSON array of matching documents or an error message.
 */
export const searchDocuments = async (req: Request, res: Response) => {
  try {
    const search = (req.query.q as string) || "";
    const userId = req.user!._id;

    const docs = await searchDocumentsInDb(userId, search);

    return res.json(docs);

  } catch (err) {
    console.error("Error searching documents:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
