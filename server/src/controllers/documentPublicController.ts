import { Request, Response } from "express";
import { getPublicDocumentById } from "../services/documentPublicService";

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
