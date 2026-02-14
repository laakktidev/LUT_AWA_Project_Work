import { User } from "../models/User";

/**
 * Updates the profile picture path for a user.
 *
 * @remarks
 * This function:
 * - updates only the `profilePicture` field
 * - does not validate file existence or type
 * - does not return the updated document unless `{ new: true }` is added
 *
 * File upload handling (storage, validation, cleanup) is expected to be
 * managed by the controller or middleware layer.
 *
 * @param userId - The ID of the user whose profile picture is being updated.
 * @param filePath - The file path or URL of the uploaded profile image.
 *
 * @returns The result of the update operation.
 */
export async function updateUserProfilePicture(userId: string, filePath: string) {
  return User.findByIdAndUpdate(userId, {
    profilePicture: filePath
  });
}
