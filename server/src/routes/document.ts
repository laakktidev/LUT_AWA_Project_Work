import { Router, Request, Response } from "express";
import { Document } from "../models/Document";
import { authenticateUser } from "../middleware/validateToken";

const router = Router();

// CREATE a document
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

router.get("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Permission check
    const isOwner = doc.userId.toString() === userId;
    const isEditor = doc.editors.some(e => e.toString() === userId);

    if (!isOwner && !isEditor) {
      return res.status(403).json({ message: "No permission to view this document" });
    }

    // Lock check on OPEN
    if (doc.lock.isLocked && doc.lock.lockedBy?.toString() !== userId) {
      //return res.status(423).json({ message: "Document is locked by another user" });
      // Lock check on OPEN (viewing)

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



/*router.get("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user!._id },
        { editors: req.user!._id }
      ]
    });

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.json(doc);
  } catch (err) {
    console.error("Error fetching document:", err);
    return res.status(500).json({ message: "Server error" });
  }
});*/


router.get("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const docs = await Document.find({
      $or: [
        { userId: req.user!._id },
        { editors: req.user!._id }
      ]
    }).sort({ updatedAt: -1 });

    return res.json(docs);
  } catch (err) {
    console.error("Error fetching documents:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// UPDATE a document (owner OR editor)
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
      return res.status(404).json({ message: "Document not found or no permission" });
    }

    return res.json(updated);
  } catch (err) {
    console.error("Error updating document:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// DELETE a document
router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {

    const id: string = req.params.id as string;

    // ONLY owner can delete
    const deleted = await Document.findOneAndDelete({
      _id: id,
      userId: req.user!._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Document not found or no permission" });
    }

    return res.status(200).json({ message: "Document deleted" });
  } catch (err) {
    console.error("Error deleting document:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// PATCH /documents/:id/editors
router.patch("/:id/editors", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userIds } = req.body; // array of user IDs

    if (!Array.isArray(userIds)) {
      console.log("User IDs must be an array");
      return res.status(400).json({ message: "UserIDs must be an array" });
    }

    //console.log("user:", req.user);

    // ONLY owner can add editors
    const doc = await Document.findOne({
      _id: id,
      userId: req.user!._id
    });

    console.log("id:", id);
    console.log("useId:", id);
    console.log("editors:", userIds);

    if (!doc) {
      return res.status(404).json({ message: "Document not found or no permission" });
    }

    //res.status(200).json("updated");


    const updated = await Document.findByIdAndUpdate(
      id,
      { $addToSet: { editors: { $each: userIds } } },
      { new: true }
    );

    //console.log("Updated document editors:", updated);
    return res.status(200).json({ message: "New editor(s) added" });

  } catch (err) {
    console.error("Error updating editors:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


router.put("/:id/public", authenticateUser, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const { isPublic } = req.body;

    if (typeof isPublic !== "boolean") {
      return res.status(400).json({ message: "isPublic must be boolean" });
    }

    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const isOwner = doc.userId.toString() === userId;

    // Only owner can change visibility
    if (!isOwner) {
      return res.status(403).json({ message: "Only the owner can change visibility" });
    }

    doc.isPublic = isPublic;
    await doc.save();

    return res.json({ message: "Visibility updated", isPublic: doc.isPublic });

  } catch (err) {
    console.error("Error updating public status:", err);
    return res.status(500).json({ message: "Server error" });
  }
});



export default router;