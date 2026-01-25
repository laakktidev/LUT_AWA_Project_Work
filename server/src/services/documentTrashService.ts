import { Document } from "../models/Document";


// GET TRASH DOCUMENTS
export async function getTrashDocuments(userId: string) {
  return Document.find({
    userId,
    isDeleted: true
  }).sort({ deletedAt: -1 });
}


// COUNT TRASH ITEMS
export async function getTrashCount(userId: string) {
  return Document.countDocuments({
    userId,
    isDeleted: true
  });
}


// SOFT DELETE
export async function softDeleteDocumentById(id: string) {
  return Document.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
}


// RESTORE
export async function restoreDocumentById(id: string) {
  return Document.findByIdAndUpdate(
    id,
    { isDeleted: false, deletedAt: null },
    { new: true }
  );
}


// GET ALL DELETED DOCUMENTS (for empty trash)
export async function getAllDeletedDocuments(userId: string) {
  return Document.find({
    userId,
    isDeleted: true
  });
}


// PERMANENT DELETE
export async function permanentlyDeleteDocuments(userId: string) {
  return Document.deleteMany({
    userId,
    isDeleted: true
  });
}
