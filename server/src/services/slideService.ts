import { Presentation } from "../models/Presentation";

/**
 * Creates a new presentation.
 *
 * @remarks
 * This function forwards the provided data directly to Mongoose.
 * Validation, defaults, and schema rules are handled by the model.
 *
 * @param data - The fields required to create a presentation.
 *
 * @returns The newly created presentation document.
 */
export async function createPresentationService(data: any) {
  return Presentation.create(data);
}

/**
 * Retrieves all presentations owned by a user.
 *
 * @remarks
 * Presentations are sorted by `createdAt` in descending order so the
 * newest ones appear first.
 *
 * @param userId - The ID of the user requesting their presentations.
 *
 * @returns A list of presentations owned by the user.
 */
export async function listPresentationsService(userId: string) {
  return Presentation.find({ userId }).sort({ createdAt: -1 });
}

/**
 * Retrieves a single presentation owned by a user.
 *
 * @remarks
 * This enforces ownership by requiring both:
 * - the presentation ID
 * - the user ID
 *
 * Editors are not included here — only owners can fetch via this service.
 *
 * @param id - The ID of the presentation.
 * @param userId - The ID of the owner.
 *
 * @returns The presentation if found, otherwise `null`.
 */
export async function getPresentationService(id: string, userId: string) {
  return Presentation.findOne({ _id: id, userId });
}

/**
 * Updates a presentation owned by a user.
 *
 * @remarks
 * This function:
 * - enforces ownership
 * - applies the provided update data
 * - returns the updated document (`new: true`)
 *
 * @param id - The ID of the presentation to update.
 * @param userId - The ID of the owner.
 * @param data - The fields to update.
 *
 * @returns The updated presentation, or `null` if not found or unauthorized.
 */
export async function updatePresentationService(
  id: string,
  userId: string,
  data: any
) {
  return Presentation.findOneAndUpdate(
    { _id: id, userId },
    data,
    { new: true }
  );
}

/**
 * Deletes a presentation owned by a user.
 *
 * @remarks
 * This is a **hard delete** — the presentation is permanently removed.
 *
 * @param id - The ID of the presentation to delete.
 * @param userId - The ID of the owner.
 *
 * @returns The deleted presentation, or `null` if not found or unauthorized.
 */
export async function deletePresentationService(id: string, userId: string) {
  return Presentation.findOneAndDelete({ _id: id, userId });
}
