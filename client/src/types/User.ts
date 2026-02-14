/**
 * Represents a registered user within the system.
 * Includes identity, authentication details, and profile metadata.
 */
export interface User {
  /** Unique identifier for the user. */
  id: string;

  /** Email address associated with the account. */
  email: string;

  /** Display name chosen by the user. */
  username: string;

  /** URL of the user's profile picture, or null if none is set. */
  profilePicture: string | null;
}
