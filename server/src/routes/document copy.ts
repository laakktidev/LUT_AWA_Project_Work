import { Router, Request, Response } from "express";
import { Document } from "../models/Document";
import { authenticateUser } from "../middleware/validateToken";

const router = Router();

/* -------------------------------------------------------
   CREATE DOCUMENT (owner only)
------------------------------------------------------- */
router.post("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newDoc = await Document.create({
      userId: req.user!._id,
      title,
      content: content || ""
    });

    return res.status(200).json(newDoc);
  } catch (err) {
    console.error("Error creating document:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------------
   GET ALL DOCUMENTS (owner OR editor)
------------------------------------------------------- */
router.get("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const docs = await Document.find({
      $or: [
        { userId: req.user!._id },
        { editors: req.user!._id }
      ],
      isDeleted: { $ne: true }
    }).sort({ updatedAt: -1 });

    return res.json(docs);
  } catch (err) {
    console.error("Error fetching documents:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// GET /documents/trash
router.get("/trash", authenticateUser, async (req: Request, res: Response) => {
  try {
    const docs = await Document.find({
      userId: req.user!._id,
      isDeleted: true
    }).sort({ deletedAt: -1 });

    return res.json(docs);
  } catch (err) {
    console.error("Error fetching trash:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// GET /documents/trash/count
router.get("/trash/count", authenticateUser, async (req: Request, res: Response) => {
  try {
    const count = await Document.countDocuments({
      userId: req.user!._id,
      isDeleted: true
    });

    return res.json({ count });
  } catch (err) {
    console.error("Error counting trash:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/clone", authenticateUser, async (req, res) => {
  try {
    const original = await Document.findOne({
      _id: req.params.id,
      userId: req.user!._id
    });

    if (!original) {
      return res.status(404).json({ message: "Document not found" });
    }

    const clone = new Document({
      title: original.title + " (Copy)",
      content: original.content,
      userId: req.user!._id,
      editors: [],
      isPublic: false,
      isDeleted: false,
      deletedAt: null
    });

    await clone.save();

    return res.status(201).json(clone);
  } catch (err) {
    console.error("Clone error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


/* -------------------------------------------------------
   ADD EDITORS (OWNER ONLY)
------------------------------------------------------- */
router.patch("/:id/editors", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds)) {
      return res.status(400).json({ message: "userIds must be an array" });
    }

    const doc = await Document.findOne({
      _id: req.params.id,
      userId: req.user!._id   // OWNER ONLY
    });

    if (!doc) {
      return res.status(403).json({ message: "Not allowed to modify editors" });
    }

    await Document.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { editors: { $each: userIds } } },
      { new: true }
    );

    return res.status(200).json({ message: "Editors updated" });

  } catch (err) {
    console.error("Error updating editors:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// PATCH /documents/:id/soft-delete
router.patch("/:id/soft-delete", authenticateUser, async (req: Request, res: Response) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });

  // permission check here (owner only)
  doc.isDeleted = true;
  doc.deletedAt = new Date();

  await doc.save();

  //res.json(doc);
  return res.status(200).json({ message: "Moved to trash", doc });

});


router.patch("/:id/restore", authenticateUser, async (req: Request, res: Response) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });

  // permission check here (owner only)
  doc.isDeleted = false;
  doc.deletedAt = null;

  await doc.save();

  //res.json(doc);
  return res.status(200).json({ message: "Restored", doc });

});



/* -------------------------------------------------------
   UPDATE PUBLIC VISIBILITY (OWNER ONLY)
------------------------------------------------------- */
router.patch("/:id/public", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { isPublic } = req.body;

    if (typeof isPublic !== "boolean") {
      return res.status(400).json({ message: "isPublic must be boolean" });
    }

    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const isOwner = doc.userId.toString() === req.user!._id.toString();

    if (!isOwner) {
      return res.status(403).json({ message: "Only the owner can change visibility" });
    }

    doc.isPublic = isPublic;
    await doc.save();

    return res.json({ message: "Visibility updated", isPublic });

  } catch (err) {
    console.error("Error updating public status:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------------
   GET SINGLE DOCUMENT (owner OR editor OR public)
------------------------------------------------------- */
router.get("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const isOwner = doc.userId.toString() === userId;
    const isEditor = doc.editors.some(e => e.toString() === userId);
    const isPublic = doc.isPublic === true;

    // SECURITY: Only owner, editor, or public can view
    if (!isOwner && !isEditor && !isPublic) {
      return res.status(403).json({ message: "No permission to view this document" });
    }

    // Lock check (viewing allowed, but warn)
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
});


/* -------------------------------------------------------
   UPDATE DOCUMENT (OWNER and EDITORS)
------------------------------------------------------- */
router.put("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const updated = await Document.findOneAndUpdate(
      // UPDATE DOCUMENT (OWNER OR EDITOR)
      {
        _id: req.params.id,
        $or: [
          { userId: req.user!._id },
          { editors: req.user!._id }
        ]
      },
      { title: req.body.title, content: req.body.content },
      { new: true }
    );

    if (!updated) {
      return res.status(403).json({ message: "Not allowed to edit this document" });
    }

    return res.json(updated);
  } catch (err) {
    console.error("Error updating document:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------------
   DELETE DOCUMENT (OWNER ONLY)
------------------------------------------------------- */
router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const deleted = await Document.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!._id
    });

    if (!deleted) {
      return res.status(403).json({ message: "Not allowed to delete this document" });
    }

    return res.status(200).json({ message: "Document deleted" });
  } catch (err) {
    console.error("Error deleting document:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


export default router;
