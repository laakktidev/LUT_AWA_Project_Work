import { useEffect, useState } from "react";
import { getDocuments } from "../services/documentService";
import { Document } from "../types/Document";

export function useDocument(token: string | null) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchDocuments() {
    if (!token) {
      setLoading(false);
      setError("Not authenticated");
      return;
    }

    try {
      setLoading(true);
      const data = await getDocuments(token);
      setDocuments(data);
      setError(null);
    } catch {
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, [token]);

  return {
    documents,
    loading,
    error,
    refetch: fetchDocuments,   // <— expose refetch
  };
}
