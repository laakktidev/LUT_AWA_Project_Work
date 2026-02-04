import { useEffect, useState } from "react";
import { getAllItems } from "../services/itemService";
import { Item } from "../types/Item";

export function useItems(token: string | null) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchItems() {
    if (!token) {
      setLoading(false);
      setError("Not authenticated");
      return;
    }

    try {
      setLoading(true);
      const data = await getAllItems(token);
      setItems(data);
      setError(null);
    } catch {
      setError("Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, [token]);

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
  };
}
