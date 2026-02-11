import { useEffect, useState, useCallback } from "react";
import { getDocumentById } from "../services/documentService";
import { getPublicDocumentById } from "../services/publicService";
import { Document } from "../types/Document";
import { useAuthGuard } from "./useAuthGuard";

export function useDocument(
  id: string | undefined,
  token: string | null,
  onSessionExpired?: () => void
) {
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const guard = useAuthGuard();

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
        return; // ❗ IMPORTANT: do NOT set error
      }

      setError("Failed to load document");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  return { doc, loading, error, refetch: fetchDoc };
}
