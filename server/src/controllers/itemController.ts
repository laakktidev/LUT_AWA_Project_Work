import { Request, Response } from "express";
import { Document } from "../models/Document";
import { Presentation } from "../models/Presentation";

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;

    // Fetch documents
    const documents = await Document.find({ userId, isDeleted: false })
      .sort({ updatedAt: -1 })
      .lean();

    // Fetch presentations
    const presentations = await Presentation.find({ userId })
      .sort({ updatedAt: -1 })
      .lean();

    // Normalize both into a shared structure
    const items = [
      ...documents.map((doc) => ({
        _id: doc._id,
        title: doc.title,
        type: "document",
        updatedAt: doc.updatedAt,
        createdAt: doc.createdAt,
        userId: doc.userId,
        editors: doc.editors,
        isPublic: doc.isPublic
      })),

      ...presentations.map((p) => ({
        _id: p._id,
        title: p.title,
        type: "presentation",
        updatedAt: p.updatedAt,
        createdAt: p.createdAt,
        userId: p.userId
      }))
    ];

    // Sort newest first
    items.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return res.json(items);

  } catch (err) {
    console.error("Error fetching items:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
