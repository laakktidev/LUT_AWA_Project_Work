import { useEffect, useState, useCallback } from "react";
import { getDocumentById } from "../services/documentService";
import { Document } from "../types/Document";

export function useDocument(id: string | undefined, token: string | null) {
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoc = useCallback(async () => {
    if (!id || !token) return;

    try {
      setLoading(true);
      setError(null);

      const data = await getDocumentById(id, token);
      setDoc(data);
    } catch (err) {
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
