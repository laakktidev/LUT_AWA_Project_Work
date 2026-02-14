import { useEffect, useState, useCallback } from "react";
import { getPresentationById } from "../services/presentationService";
import { Presentation } from "../types/Presentation";

/**
 * Loads a single presentation by ID for an authenticated user.
 *
 * @remarks
 * This hook:
 * - requires both a valid `id` and `token`
 * - fetches the presentation from the authenticated endpoint
 * - exposes loading, error, the presentation, and a `refetch` function
 *
 * Unlike `useDocument`, this hook does **not** handle token expiration.
 * It assumes the caller already ensures valid authentication.
 *
 * @param id - The presentation ID to load.
 * @param token - Authentication token or null.
 *
 * @returns Object containing `{ presentation, loading, error, refetch }`.
 */
export function usePresentation(id: string | undefined, token: string | null) {
  /** Loaded presentation, or null if not yet available. */
  const [presentation, setPresentation] = useState<Presentation | null>(null);

  /** Whether the presentation is currently being fetched. */
  const [loading, setLoading] = useState(true);

  /** Error message, or null if no error occurred. */
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches the presentation from the backend.
   *
   * @remarks
   * - Does nothing if `id` or `token` is missing.
   * - Sets an error message if the request fails.
   */
  const fetchPresentation = useCallback(async () => {
    if (!id || !token) return;

    try {
      setLoading(true);
      setError(null);

      const data = await getPresentationById(id, token);
      setPresentation(data);
    } catch {
      setError("Failed to load presentation");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  /**
   * Automatically fetch the presentation when:
   * - the ID changes
   * - the token changes
   */
  useEffect(() => {
    fetchPresentation();
  }, [fetchPresentation]);

  return { presentation, loading, error, refetch: fetchPresentation };
}
