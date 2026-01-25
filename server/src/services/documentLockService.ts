import mongoose from "mongoose";
import { Document } from "../models/Document";


// Fetch document for lock/unlock operations
export async function getDocumentForLocking(docId: string) {
  return Document.findById(docId);
}


// Lock document
export async function lockDocumentInDb(docId: string, userId: string) {
  return Document.findByIdAndUpdate(
    docId,
    {
      lock: {
        isLocked: true,
        lockedBy: new mongoose.Types.ObjectId(userId)
      }
    },
    { new: true }
  );
}


// Unlock document
export async function unlockDocumentInDb(docId: string) {
  return Document.findByIdAndUpdate(
    docId,
    {
      lock: {
        isLocked: false,
        lockedBy: null
      }
    },
    { new: true }
  );
}
