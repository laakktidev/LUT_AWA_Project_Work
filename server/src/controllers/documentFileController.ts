import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import path from "path";
import { getDocumentById } from "../services/documentService";


// UPLOAD IMAGE
export const uploadDocumentImageController = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const protocol = req.protocol;
  const host = req.get("host");
  const url = `${protocol}://${host}/uploads/documents/${req.file.filename}`;

  return res.json({ url });
};


// GENERATE PDF
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
