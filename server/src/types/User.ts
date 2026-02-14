/**
 * Represents a user account within the application.
 *
 * @remarks
 * This interface is used across both client and server code to ensure
 * consistent typing for user-related data. It typically appears in:
 * - authentication responses
 * - user lists (e.g., sharing dialogs)
 * - profile pages
 *
 * The `_id` field corresponds to the MongoDB ObjectId.
 */
export interface User {
  /** Unique identifier for the user (MongoDB ObjectId). */
  _id: string;

  /** User's email address, used for login and communication. */
  email: string;

  /** Public-facing username displayed throughout the UI. */
  username: string;
}
