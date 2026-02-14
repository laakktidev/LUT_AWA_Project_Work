/**
 * Response returned after a successful user login.
 * Includes the authentication token and basic user profile data.
 */
export interface LoginResponse {
  /** JWT token used for authenticated API requests. */
  token: string;

  /** Basic user information returned by the backend. */
  user: {
    /** Unique identifier for the user. */
    id: string;

    /** Email address associated with the account. */
    email: string;

    /** Display name chosen by the user. */
    username: string;
  };
}
