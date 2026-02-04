
import { Request, Response } from "express";
import { searchDocumentsInDb } from "../services/documentSearchService";


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
