import { Request, Response } from "express";
import mongoose from "mongoose";
import { Document } from "../models/Document";


export const lockDocument = async (req: Request, res: Response) => {

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const { id } = req.params;

    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (doc.lock.isLocked && doc.lock.lockedBy?.toString() !== userId) {
        return res.status(423).json({ message: "Document is locked by another user" });
    }

    doc.lock.isLocked = true;
    doc.lock.lockedBy = new mongoose.Types.ObjectId(userId);

    await doc.save();

    res.json({ message: "Document locked" });
};

export const unlockDocument = async (req: Request, res: Response) => {

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const userId = req.user._id;

    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Only the locker can unlock
    if (doc.lock.lockedBy?.toString() !== userId) {
        return res.status(403).json({ message: "You do not own the lock" });
    }

    doc.lock.isLocked = false;
    doc.lock.lockedBy = null;
    await doc.save();

    res.json({ message: "Document unlocked" });
};
