import { useEffect, useState, useCallback } from "react";
import { getDocuments } from "../services/documentService";
import { Document } from "../types/Document";
import { useAuthGuard } from "./useAuthGuard";

/**
 * Fetches the authenticated user's document list.
 *
 * @remarks
 * - Validates the token using `useAuthGuard`.
 * - Calls `onSessionExpired` instead of setting an error when the token is invalid.
 * - Returns loading state, error state, the document list, and a `refetch` function.
 *
 * This hook is used on pages that list a user's private documents.
 *
 * @param token - Authentication token or null.
 * @param onSessionExpired - Optional callback fired when the token is expired.
 */
export function useDocuments(
  token: string | null,
  onSessionExpired?: () => void
) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const guard = useAuthGuard();

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Document[];

      if (token) {
        const validToken = guard();
        data = await getDocuments(validToken);
        setDocuments(data);
      } else {
        setDocuments([]);
      }
    } catch (err: any) {
      if (err.message === "TOKEN_EXPIRED") {
        onSessionExpired?.();
        return;
      }
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [token]); // ← correct: guard is intentionally NOT included

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    refetch: fetchDocuments,
  };
}
