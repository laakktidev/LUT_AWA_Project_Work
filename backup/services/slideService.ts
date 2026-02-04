// src/services/slideService.ts
import { ISlideDeck } from "../types/Slides";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/* -----------------------------
   CREATE
------------------------------*/
export async function createSlideDeck(
  payload: Partial<ISlideDeck>,
  token: string
): Promise<ISlideDeck> {
  const res = await fetch(`${API_URL}/slides`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("Failed to create slide deck");
  }

  return res.json();
}

/* -----------------------------
   UPDATE
------------------------------*/
export async function updateSlideDeck(
  id: string,
  payload: Partial<ISlideDeck>,
  token: string
): Promise<ISlideDeck> {
  const res = await fetch(`${API_URL}/slides/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("Failed to update slide deck");
  }

  return res.json();
}

/* -----------------------------
   GET ONE
------------------------------*/
export async function getSlideDeck(
  id: string,
  token: string
): Promise<ISlideDeck> {
  const res = await fetch(`${API_URL}/slides/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch slide deck");
  }

  return res.json();
}
