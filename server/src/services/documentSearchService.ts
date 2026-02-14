import { Document } from "../models/Document";

/**
 * Searches documents belonging to or shared with a user.
 *
 * @remarks
 * This function performs a combined search with the following rules:
 *
 * **1. Visibility**
 * - Only documents that are *not deleted* (`isDeleted !== true`) are returned.
 *
 * **2. Permissions**
 * A document is included if:
 * - the user is the owner (`userId`)
 * - OR the user is an editor (`editors`)
 *
 * **3. Search Matching**
 * The search term is matched (case‑insensitive) against:
 * - the document title
 * - the document content
 *
 * **4. Sorting**
 * Results are sorted by `updatedAt` in descending order (most recently edited first).
 *
 * @param userId - The ID of the user performing the search.
 * @param search - The search string to match against title and content.
 *
 * @returns A list of matching documents.
 */
export async function searchDocumentsInDb(userId: string, search: string) {
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
