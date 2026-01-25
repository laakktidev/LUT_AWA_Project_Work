import { Document } from "../models/Document";


// Fetch document only if user is owner
export async function getDocumentForCloning(docId: string, userId: string) {
  return Document.findOne({
    _id: docId,
    userId
  });
}


// Create a cloned document
export async function cloneDocumentInDb(original: any, userId: string) {
  const clone = new Document({
    title: original.title + " (Copy)",
    content: original.content,
    userId,
    editors: [],
    isPublic: false,
    isDeleted: false,
    deletedAt: null
  });

  await clone.save();
  return clone;
}
