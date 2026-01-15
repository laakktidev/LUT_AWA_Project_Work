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
});


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
    
    const id: string = req.params.id;

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
router.patch("/:id/editors", authenticateUser, async(req: Request, res: Response) => {
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


/*
router.post("/:id/editors", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { documentId, userIds} = req.body;

    console.log("documentId:", documentId);
    console.log("userIds:", userIds);
    //console.log("token:", token);

    

    if (!userIds) {
      return res.status(400).json({ message: "userIds array is required" });
    }

    // ONLY owner can add editors
    const doc = await Document.findOne({
      _id: req.params.id,
      userId: req.user!._id
    });

    if (!doc) {
      return res.status(404).json({ message: "Document not found or no permission" });
    }

    // tämä varmistettiin myös clientissa
    if (!doc.editors.includes(userIdToAdd)) {
      doc.editors.push(userIdToAdd);
      await doc.save();
    }

    return res.json({ message: "Editor added", doc });
    
    console.log("ADDING EDITORS");
    return res.status(666).json({ message: "ADDING EDITORS" });

  } catch (err) {
    console.error("Error adding editor:", err);
    return res.status(500).json({ message: "Server error" });
  }
})*/


import crypto from "crypto";

// GENERATE a view-only link (owner only) thats why authenticateUser  
router.post("/:id/view-token", authenticateUser, async (req: Request, res: Response) => {
  try {
    // Only owner can generate view link
    const doc = await Document.findOne({
      _id: req.params.id,
      userId: req.user!._id
    });

    if (!doc) {
      return res.status(404).json({ message: "Document not found or no permission" });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");

    doc.viewToken = token;
    await doc.save();

    return res.json({
      message: "View link generated",
      viewUrl: `${process.env.FRONTEND_URL}/documents/${doc._id}/public?view-token=${token}`
    });
  } catch (err) {
    console.error("Error generating view link:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// PUBLIC VIEW via token (no login required)
router.get("/:id/public", async (req: Request, res: Response) => {
  try {
    const token = req.query["view-token"];

    if (!token) {
      return res.status(400).json({ message: "Missing view-token" });
    }

    const doc = await Document.findOne({
      _id: req.params.id,
      viewToken: token
    }).select("title content updatedAt createdAt");

    if (!doc) {
      return res.status(404).json({ message: "Invalid or expired view-token" });
    }

    return res.json(doc);
  } catch (err) {
    console.error("Error fetching public document:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


export default router;