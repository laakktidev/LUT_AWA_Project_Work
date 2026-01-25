import { Request, Response } from "express";
import { getDocumentForCloning, cloneDocumentInDb } from "../services/documentCloneService";


// CLONE DOCUMENT
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
