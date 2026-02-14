import { useAuth } from "../context/AuthContext";
import { isTokenExpired } from "../utils/isTokenExpired";

/**
 * Provides a guard function that validates the current authentication token.
 *
 * @remarks
 * This hook is designed for protecting **actions**, not routes.
 * It is ideal for:
 * - API calls
 * - mutations
 * - operations that require a valid token at execution time
 *
 * Behavior:
 * - Throws `"TOKEN_EXPIRED"` if the token is missing or expired.
 * - Returns the token when valid.
 *
 * For route-level protection, use `<RequireAuth />` instead.
 *
 * @returns A function that validates the token and returns it if valid.
 */
export function useAuthGuard() {
  const { token } = useAuth();

  /**
   * Validates the current authentication token.
   *
   * @throws `"TOKEN_EXPIRED"` when the token is missing or expired.
   * @returns The valid token string.
   */
  function guard() {
    if (!token || isTokenExpired(token)) {
      throw new Error("TOKEN_EXPIRED");
    }
    return token;
  }

  return guard;
}
