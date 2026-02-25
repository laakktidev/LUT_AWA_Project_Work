import { Request, Response } from "express";
import { getDocumentById } from "../services/documentService";
import { sendPublicLinkEmail } from "../services/emailService";

/**
 * Sends a public document link to a specified email address.
 *
 * @remarks
 * This controller:
 * - loads the document by ID
 * - verifies that the authenticated user is the owner
 * - ensures the document is marked as public
 * - generates a public URL based on `APP_URL`
 * - sends the link via `sendPublicLinkEmail`
 *
 * This is typically used when a user wants to share a public‑viewable
 * document with someone via email.
 *
 * @param req - Express request containing document ID and target email.
 * @param res - Express response confirming the email was sent.
 *
 * @returns A JSON message or an error response.
 */
export async function sendPublicLink(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const userId = req.user?._id;

    const doc = await getDocumentById(id as string);

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

    const ret = await sendPublicLinkEmail(email, publicUrl);
    //console.log("Email send result:", ret);

    return res.json({ message: "Email sent" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
