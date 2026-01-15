import { useEffect, useState } from "react";
import { getDocumentById } from "../services/documentService";
import { Document } from "../types/Document";

export function useDocument(id: string | undefined, token: string | null) {
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !token) return;

    async function load() {
      try {
        setLoading(true);
        const data = await getDocumentById(id as string, token as string );
        setDoc(data);
      } catch (err) {
        setError("Failed to load document");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, token]);

  return { doc, loading, error };
}
