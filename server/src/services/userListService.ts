import { User } from "../models/User";

/**
 * Retrieves a list of all users with limited public fields.
 *
 * @remarks
 * This function:
 * - returns all users in the database
 * - excludes the internal MongoDB `_id` field
 * - exposes a renamed `id` field mapped from `$_id`
 * - includes only `email` and `username`
 *
 * This is typically used for:
 * - sharing dialogs
 * - autocomplete lists
 * - admin tools
 *
 * Sensitive fields such as `password` are never returned.
 *
 * @returns A list of users with safe, public-facing fields.
 */
export async function listAllUsers() {
  return User.find().select({
    _id: 0,
    id: "$_id",
    email: 1,
    username: 1
  });
}
