import { useEffect, useState, useCallback } from "react";
import { getDocuments } from "../services/documentService";
import { Document } from "../types/Document";

export function useDocuments(
  token: string | null,
  onSessionExpired?: () => void
) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Not authenticated");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getDocuments(token);
      setDocuments(data);
    } catch (err: any) {
      // Detect expired token from API response
      if (err?.response?.status === 401) {
        onSessionExpired?.();
        return;
      }

      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [token]); // ✔ stable, no infinite loop

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
