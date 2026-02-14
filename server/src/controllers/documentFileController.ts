import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import path from "path";
import { getDocumentById } from "../services/documentService";

/* =======================================================
   UPLOAD DOCUMENT IMAGE
   ------------------------------------------------------- */
/**
 * Handles image uploads for document content.
 *
 * @remarks
 * This controller:
 * - expects a file uploaded via Multer (`req.file`)
 * - constructs a public URL pointing to the uploaded file
 * - returns the URL so the frontend can embed it into the document
 *
 * The file is stored in `/uploads/documents/` by Multer configuration.
 *
 * @param req - Express request containing the uploaded file.
 * @param res - Express response returning the file URL.
 *
 * @returns A JSON object containing the public image URL.
 */
export const uploadDocumentImageController = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const protocol = req.protocol;
  const host = req.get("host");
  const url = `${protocol}://${host}/uploads/documents/${req.file.filename}`;

  return res.json({ url });
};

/* =======================================================
   GENERATE PDF FROM DOCUMENT
   ------------------------------------------------------- */
/**
 * Generates a PDF version of a document.
 *
 * @remarks
 * This controller:
 * - loads the document by ID
 * - checks whether the user is the owner or an editor
 * - streams a dynamically generated PDF to the client
 *
 * The PDF includes:
 * - the document title (large, underlined)
 * - the document content (plain text)
 *
 * Images inside the document content are not rendered; this is a text‑only export.
 *
 * @param req - Express request containing the document ID and user info.
 * @param res - Express response streaming the PDF file.
 *
 * @returns A streamed PDF file or an error response.
 */
export const generatePdf = async (req: Request, res: Response) => {
  const doc = await getDocumentById(req.params.id as string);

  if (!doc) {
    return res.status(404).json({ message: "Document not found" });
  }

  const userId = req.user!._id.toString();
  const isOwner = doc.userId.toString() === userId;
  const isEditor = doc.editors.some(e => e.equals(userId));

  if (!isOwner && !isEditor) {
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
};
