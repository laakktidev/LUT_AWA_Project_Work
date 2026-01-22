import { Router, Request, Response } from "express";
import { Document } from "../models/Document";
import { authenticateUser } from "../middleware/validateToken";
import PDFDocument from "pdfkit";


const router = Router();


//   CREATE DOCUMENT

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

// DOCUMENTS IN TRASH
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

router.delete("/trash/empty", authenticateUser, async (req: Request, res: Response) => {
  try {
    const result = await Document.deleteMany({
      userId: req.user!._id,
      isDeleted: true
    });

    return res.status(200).json({
      message: "Trash emptied",
      deletedCount: result.deletedCount
    });

  } catch (err) {
    console.error("Error emptying trash:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// COUNT OF ITEMS IN TRASH
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


// CLONE DOCUMENT
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

// ADD EDITORS
router.patch("/:id/editors", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds)) {
      return res.status(400).json({ message: "userIds must be an array" });
    }

    const doc = await Document.findOne({
      _id: req.params.id,
      userId: req.user!._id
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

// SOFT DELETE
router.patch("/:id/soft-delete", authenticateUser, async (req: Request, res: Response) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });

  doc.isDeleted = true;
  doc.deletedAt = new Date();

  await doc.save();

  return res.status(200).json({ message: "Moved to trash", doc });
});

// RESTORE
router.patch("/:id/restore", authenticateUser, async (req: Request, res: Response) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });

  doc.isDeleted = false;
  doc.deletedAt = null;

  await doc.save();

  return res.status(200).json({ message: "Restored", doc });
});

// UPDATE PUBLIC VISIBILITY
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


// GET ALL DOCUMENTS

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


// SEARCH FROM ALL DOCUMENTS 

router.get("/search", authenticateUser, async (req: Request, res: Response) => {
  try {
    const search = (req.query.q as string) || "";

    const docs = await Document.find({
      isDeleted: { $ne: true },

      $and: [
        // user must be owner OR editor
        {
          $or: [
            { userId: req.user!._id },
            { editors: req.user!._id }
          ]
        },

        // title OR content must match search
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } }
          ]
        }
      ]
    }).sort({ updatedAt: -1 });

    return res.json(docs);

  } catch (err) {
    console.error("Error fetching documents:", err);
    return res.status(500).json({ message: "Server error" });
  }
});




// GET SINGLE DOCUMENT
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

    if (!isOwner && !isEditor && !isPublic) {
      return res.status(403).json({ message: "No permission to view this document" });
    }

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

// UPDATE DOCUMENT
router.put("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const updated = await Document.findOneAndUpdate(
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

// DELETE DOCUMENT
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


router.get("/:id/pdf", authenticateUser, async (req, res) => {
  const doc = await Document.findById(req.params.id);

  if (!doc) {
    return res.status(404).json({ message: "Document not found" });
  }

  // Only owner or editor can download
  const userId = req.user!._id.toString();

  if (doc.userId.toString() !== userId && !doc.editors.some(e => e.equals(userId))) {
  
    return res.status(403).json({ message: "Not allowed" });
  }

  const pdf = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${doc.title}.pdf"`);

  pdf.pipe(res);

  pdf.fontSize(20).text(doc.title, { underline: true });
  pdf.moveDown();
  pdf.fontSize(12).text(doc.content || "");

  pdf.end();
});


export default router;
