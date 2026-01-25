import { Document } from "../models/Document";

export async function createDocumentInDb(data: any) {
  return Document.create(data);
}

export async function getAllDocumentsForUser(userId: string) {
  return Document.find({
    $or: [
      { userId },
      { editors: userId }
    ],
    isDeleted: { $ne: true }
  }).sort({ updatedAt: -1 });
}

export async function getDocumentById(id: string) {
  return Document.findById(id);
}

export async function updateDocumentById(id: string, data: any) {
  return Document.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteDocumentById(id: string) {
  return Document.findByIdAndDelete(id);
}
