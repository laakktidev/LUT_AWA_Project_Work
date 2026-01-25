import { Document } from "../models/Document";

export async function searchDocumentsForUser(userId: string, search: string) {
  return Document.find({
    isDeleted: { $ne: true },

    $and: [
      {
        $or: [
          { userId },
          { editors: userId }
        ]
      },
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } }
        ]
      }
    ]
  }).sort({ updatedAt: -1 });
}
