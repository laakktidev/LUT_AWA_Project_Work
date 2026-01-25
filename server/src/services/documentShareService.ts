import { Document } from "../models/Document";


// Check if user is owner before modifying editors
export async function getDocumentForSharing(docId: string, userId: string) {
  return Document.findOne({
    _id: docId,
    userId
  });
}


// Add editors
export async function addEditorsToDocument(docId: string, userIds: string[]) {
  return Document.findByIdAndUpdate(
    docId,
    { $addToSet: { editors: { $each: userIds } } },
    { new: true }
  );
}


// Update public visibility
export async function updatePublicVisibilityInDb(
  docId: string,
  userId: string,
  isPublic: boolean
) {
  const doc = await Document.findById(docId);
  if (!doc) return null;

  const isOwner = doc.userId.toString() === userId.toString();
  if (!isOwner) return null;

  doc.isPublic = isPublic;
  await doc.save();

  return doc;
}
