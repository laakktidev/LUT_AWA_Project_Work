import { useEffect, useState } from "react";
import { getPresentations } from "../services/presentationService";
import { Presentation } from "../types/Presentations";

export function usePresentations(token: string | null) {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchPresentations() {
    if (!token) {
      setLoading(false);
      setError("Not authenticated");
      return;
    }

    try {
      setLoading(true);
      const data = await getPresentations(token);
      setPresentations(data);
      setError(null);
    } catch {
      setError("Failed to load presentations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPresentations();
  }, [token]);

  return {
    presentations,
    loading,
    error,
    refetch: fetchPresentations,
  };
}
