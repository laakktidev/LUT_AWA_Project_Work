import { useEffect, useState, useCallback } from "react";
import { getPresentationById } from "../services/presentationService";
import { Presentation } from "../types/Presentation";

export function usePresentation(id: string | undefined, token: string | null) {
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPresentation = useCallback(async () => {
    if (!id || !token) return;

    try {
      setLoading(true);
      setError(null);

      const data = await getPresentationById(id, token);
      setPresentation(data);
    } catch (err) {
      setError("Failed to load presentation");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchPresentation();
  }, [fetchPresentation]);

  return { presentation, loading, error, refetch: fetchPresentation };
}
