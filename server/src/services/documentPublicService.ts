import { Document } from "../models/Document";

export async function getPublicDocumentById(id: string) {
  return Document.findById(id);
}
