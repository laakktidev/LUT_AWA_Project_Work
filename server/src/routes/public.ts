
import { Router, Request, Response } from "express";
import { Document } from "../models/Document";

const router = Router();

router.get("/document/:id", async (req: Request, res: Response) => {
    try {
        const doc = await Document.findById(req.params.id);

        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }

        if (!doc.isPublic) {
            return res.status(403).json({ message: "This document is not public" });
        }
        
        console.log(doc);

        return res.json(doc);
    } catch (err) {
        console.error("Error fetching public document:", err);
        return res.status(500).json({
            message: "Server error"
        });
    }
});

export default router
