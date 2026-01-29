import { Request, Response } from "express";
import { getDocumentById } from "../services/documentService";
import { sendPublicLinkEmail } from "../services/emailService";

export async function sendPublicLink(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const userId = req.user?._id;

    //console.log("sendPublicLink called with:",req.user?._id);
    const doc = await getDocumentById(id as string);
    //console.log("Document fetched:", doc);

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    if (doc.userId.toString() !== userId) {
      return res.status(403).json({ error: "Not allowed" });
    }

    if (!doc.isPublic) {
      return res.status(403).json({ error: "Document is not public" });
    }

    const publicUrl = `${process.env.APP_URL}/public/${id}`;

    let ret=await sendPublicLinkEmail(email, publicUrl);
    console.log("Email send result:", ret);

    return res.json({ message: "Email sent" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
