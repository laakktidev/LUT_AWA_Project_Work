import { useEffect, useState, useCallback } from "react";
import { getDocuments } from "../services/documentService";
import { Document } from "../types/Document";
import { useAuthGuard } from "./useAuthGuard";

export function useDocuments(
  token: string | null  §
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

      // const data = await getDocuments(token);

    } catch (err: any) {
      // Detect expired token from API response
      /*
      if (err?.response?.status === 401) {
        onSessionExpired?.();
        return;
      }*/

      if (err.message === "TOKEN_EXPIRED") {
        onSessionExpired?: () => void
        setError(err);
        return; // ❗ IMPORTANT: do NOT set error
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
