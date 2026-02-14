import { useEffect, useState } from "react";
import { getPresentations } from "../services/presentationService";
import { Presentation } from "../types/Presentation";

/**
 * Loads all presentations for the authenticated user.
 *
 * @remarks
 * This hook:
 * - requires a valid authentication token
 * - fetches the user's presentations from the backend
 * - exposes loading, error, the presentation list, and a `refetch` function
 *
 * It does **not** handle token expiration.  
 * Callers should ensure the token is valid (e.g., via `useAuthGuard` or route protection).
 *
 * @param token - Authentication token or null.
 *
 * @returns Object containing `{ presentations, loading, error, refetch }`.
 */
export function usePresentations(token: string | null) {
  /** List of presentations belonging to the authenticated user. */
  const [presentations, setPresentations] = useState<Presentation[]>([]);

  /** Whether the presentation list is currently being fetched. */
  const [loading, setLoading] = useState(true);

  /** Error message, or null if no error occurred. */
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches all presentations for the authenticated user.
   *
   * @remarks
   * - If no token is provided, sets an authentication error.
   * - Sets an error message if the request fails.
   */
  async function fetchPresentations() {
    if (!token) {
      setLoading(false);
      setError("Not authenticated");
      return;
    }

    try {
      setLoading(true);
      const data = await getPresentations(token);
      setPresentations(data);
      setError(null);
    } catch {
      setError("Failed to load presentations");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Automatically fetch presentations when the token changes.
   */
  useEffect(() => {
    fetchPresentations();
  }, [token]);

  return {
    presentations,
    loading,
    error,
    refetch: fetchPresentations,
  };
}
