import { useEffect, useState, useCallback } from "react";
import { getDocumentById } from "../services/documentService";
import { getPublicDocumentById } from "../services/publicService";
import { Document } from "../types/Document";
import { useAuthGuard } from "./useAuthGuard";

/**
 * Loads a document by ID, supporting both authenticated and public access.
 *
 * @remarks
 * This hook:
 * - fetches a private document when a valid token is provided
 * - fetches a public document when no token is provided
 * - validates the token using `useAuthGuard`
 * - calls `onSessionExpired` instead of setting an error when the token is invalid
 *
 * It is used by both private and public document pages.
 *
 * @param id - The document ID to load.
 * @param token - Authentication token or null.
 * @param onSessionExpired - Optional callback fired when the token is expired.
 *
 * @returns An object containing:
 * - `doc`: The loaded document or null
 * - `loading`: Whether the request is in progress
 * - `error`: Error message or null
 * - `refetch`: Function to manually reload the document
 */
export function useDocument(
  id: string | undefined,
  token: string | null,
  onSessionExpired?: () => void
) {
  /** Loaded document, or null if not yet available. */
  const [doc, setDoc] = useState<Document | null>(null);

  /** Whether the document is currently being fetched. */
  const [loading, setLoading] = useState(true);

  /** Error message, or null if no error occurred. */
  const [error, setError] = useState<string | null>(null);

  const guard = useAuthGuard();

  /**
   * Fetches the document from the backend.
   *
   * @remarks
   * - Uses authenticated endpoint when a token is present.
   * - Falls back to public endpoint otherwise.
   * - Handles token expiration gracefully.
   */
  const fetchDoc = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      let data: Document;

      if (token) {
        const validToken = guard();
        data = await getDocumentById(id, validToken);
      } else {
        data = await getPublicDocumentById(id);
      }

      setDoc(data);
    } catch (err: any) {
      if (err.message === "TOKEN_EXPIRED") {
        onSessionExpired?.();
        return; // Do NOT set error
      }

      setError("Failed to load document");
    } finally {
      setLoading(false);
    }
  }, [id, token]); // ← correct: guard intentionally NOT included

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  return { doc, loading, error, refetch: fetchDoc };
}
