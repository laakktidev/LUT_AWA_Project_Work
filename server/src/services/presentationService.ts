import { Presentation, IPresentation } from "../models/Presentation";

/**
 * Creates a new presentation in the database.
 *
 * @remarks
 * This function forwards the provided data directly to Mongoose.
 * Validation and defaults (e.g., `type: "presentation"`) are handled
 * by the Presentation schema.
 *
 * @param data - The fields required to create a presentation.
 *
 * @returns The newly created presentation document.
 */
export async function createPresentationInDb(data: {
  userId: string;
  title: string;
  slides: any[];
}) {
  return Presentation.create(data);
}

/**
 * Retrieves all presentations owned by a user.
 *
 * @remarks
 * Presentations are sorted by `updatedAt` in descending order so the
 * most recently edited ones appear first.
 *
 * @param userId - The ID of the user requesting their presentations.
 *
 * @returns A list of presentations owned by the user.
 */
export async function getAllPresentationsForUser(userId: string) {
  return Presentation.find({
    userId,
  }).sort({ updatedAt: -1 });
}

/**
 * Retrieves a single presentation by its ID.
 *
 * @remarks
 * This function does not enforce ownership or permissions.
 * Those checks are handled in the controller layer.
 *
 * @param id - The ID of the presentation to retrieve.
 *
 * @returns The presentation if found, otherwise `null`.
 */
export async function getPresentationById(id: string) {
  return Presentation.findById(id);
}

/**
 * Updates a presentation by its ID.
 *
 * @remarks
 * This function:
 * - applies the provided partial update
 * - returns the updated document (`new: true`)
 *
 * Permission checks are handled in the controller.
 *
 * @param id - The ID of the presentation to update.
 * @param update - Partial fields to update.
 *
 * @returns The updated presentation.
 */
export async function updatePresentationById(
  id: string,
  update: Partial<IPresentation>
) {
  return Presentation.findByIdAndUpdate(id, update, { new: true });
}

/**
 * Permanently deletes a presentation by its ID.
 *
 * @remarks
 * This is a hard delete and cannot be undone.
 *
 * @param id - The ID of the presentation to delete.
 *
 * @returns The deleted presentation, or `null` if not found.
 */
export async function deletePresentationById(id: string) {
  return Presentation.findByIdAndDelete(id);
}

/**
 * Searches presentations owned by a user.
 *
 * @remarks
 * The search term is matched (case‑insensitive) against:
 * - presentation title
 * - slide titles
 * - slide bullet points
 *
 * Only owned presentations are included (no shared editing yet).
 *
 * @param userId - The ID of the owner.
 * @param search - The search string.
 *
 * @returns A list of matching presentations.
 */
export async function searchPresentationsInDb(userId: string, search: string) {
  return Presentation.find({
    userId,

    $or: [
      { title: { $regex: search, $options: "i" } },
      { "slides.title": { $regex: search, $options: "i" } },
      { "slides.bullets": { $regex: search, $options: "i" } }
    ]
  }).sort({ updatedAt: -1 });
}

/* -----------------------------
   Locking
------------------------------*/

/**
 * Applies an edit lock to a presentation.
 *
 * @remarks
 * This function:
 * - sets `isLocked` to `true`
 * - assigns the lock to the requesting user
 * - sets `lockedAt` to the current timestamp
 *
 * Controllers ensure only one user can lock at a time.
 *
 * @param id - The ID of the presentation to lock.
 * @param userId - The ID of the user acquiring the lock.
 *
 * @returns The updated presentation.
 */
export async function lockPresentation(id: string, userId: string) {
  return Presentation.findByIdAndUpdate(
    id,
    {
      lock: {
        isLocked: true,
        lockedBy: userId,
        lockedAt: new Date(),
      },
    },
    { new: true }
  );
}

/**
 * Removes the edit lock from a presentation.
 *
 * @remarks
 * This function:
 * - sets `isLocked` to `false`
 * - clears `lockedBy` and `lockedAt`
 *
 * Controllers ensure only the lock owner can unlock.
 *
 * @param id - The ID of the presentation to unlock.
 *
 * @returns The updated presentation.
 */
export async function unlockPresentation(id: string) {
  return Presentation.findByIdAndUpdate(
    id,
    {
      lock: {
        isLocked: false,
        lockedBy: null,
        lockedAt: null,
      },
    },
    { new: true }
  );
}

/**
 * Retrieves a presentation for sharing operations, but only if the
 * requester is the owner.
 *
 * @remarks
 * Editors cannot modify sharing settings.
 *
 * @param docId - The ID of the presentation.
 * @param userId - The ID of the user attempting the operation.
 *
 * @returns The presentation if the user is the owner, otherwise `null`.
 */
export async function getPresentationForSharing(docId: string, userId: string) {
  return Presentation.findOne({
    _id: docId,
    userId
  });
}

/**
 * Adds one or more users as editors of a presentation.
 *
 * @remarks
 * Uses `$addToSet` with `$each` to avoid duplicates.
 *
 * @param presId - The ID of the presentation.
 * @param userIds - Array of user IDs to add as editors.
 *
 * @returns The updated presentation.
 */
export async function addEditorsToPresentation(
  presId: string,
  userIds: string[]
) {
  return Presentation.findByIdAndUpdate(
    presId,
    { $addToSet: { editors: { $each: userIds } } },
    { new: true }
  );
}
