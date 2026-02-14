import { Presentation } from "../types/Presentation";
import axios from "axios";
import { BASE_URL } from "./config";

const API_URL = BASE_URL;

/* ----------------------------------------
   Axios instance with auth header support
-----------------------------------------*/
/**
 * Creates a preconfigured Axios instance for authenticated requests.
 *
 * @remarks
 * This helper:
 * - attaches the `Authorization: Bearer <token>` header
 * - sets the base URL for all presentation‑related API calls
 * - ensures consistent JSON request formatting
 *
 * @param token - Authentication token.
 * @param baseURL - Optional override for the API base URL.
 *
 * @returns A configured Axios instance.
 */
function api(token: string, baseURL: string = API_URL) {
  return axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
}

/* =======================================================
   GET SINGLE PRESENTATION
   ------------------------------------------------------- */
/**
 * Fetches a single presentation by ID.
 *
 * @param id - Presentation ID.
 * @param token - Authentication token.
 *
 * @returns The requested presentation.
 */
export async function getPresentationById(
  id: string,
  token: string
): Promise<Presentation> {
  const res = await api(token).get<Presentation>(`/presentation/${id}`);
  return res.data;
}

/* =======================================================
   GET ALL PRESENTATIONS
   ------------------------------------------------------- */
/**
 * Fetches all presentations owned by or shared with the user.
 *
 * @param token - Authentication token.
 *
 * @returns Array of presentations.
 */
export async function getPresentations(
  token: string
): Promise<Presentation[]> {
  const res = await api(token).get<Presentation[]>(`/presentation`);
  return res.data;
}

/* =======================================================
   CREATE PRESENTATION
   ------------------------------------------------------- */
/**
 * Creates a new presentation.
 *
 * @param payload - Partial presentation data (title, slides, etc.).
 * @param token - Authentication token.
 *
 * @returns The newly created presentation.
 */
export async function createPresentation(
  payload: Partial<Presentation>,
  token: string
): Promise<Presentation> {
  const res = await api(token).post<Presentation>(`/presentation`, payload);
  return res.data;
}

/* =======================================================
   UPDATE PRESENTATION
   ------------------------------------------------------- */
/**
 * Updates an existing presentation.
 *
 * @param id - Presentation ID.
 * @param payload - Partial update payload.
 * @param token - Authentication token.
 *
 * @returns The updated presentation.
 */
export async function updatePresentation(
  id: string,
  payload: Partial<Presentation>,
  token: string
): Promise<Presentation> {
  const res = await api(token).patch<Presentation>(`/presentation/${id}`, payload);
  return res.data;
}

/* =======================================================
   DELETE PRESENTATION
   ------------------------------------------------------- */
/**
 * Deletes a presentation permanently.
 *
 * @param id - Presentation ID.
 * @param token - Authentication token.
 *
 * @returns Nothing (void).
 */
export async function deletePresentation(
  id: string,
  token: string
): Promise<void> {
  await api(token).delete(`/presentation/${id}`);
}

/* =======================================================
   SHARE PRESENTATION (ADD EDITORS)
   ------------------------------------------------------- */
/**
 * Adds users as editors to a presentation.
 *
 * @remarks
 * This allows multiple users to collaborate on the same presentation.
 *
 * @param representionId - Presentation ID.
 * @param userIds - Array of user IDs to grant edit access.
 * @param token - Authentication token.
 *
 * @returns Updated editor list or presentation metadata.
 */
export async function sharePresentation(
  representionId: string,
  userIds: string[],
  token: string
) {
  const response = await axios.patch(
    `${BASE_URL}/presentation/${representionId}/editors`,
    { userIds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}

/* =======================================================
   SEARCH PRESENTATIONS
   ------------------------------------------------------- */
/**
 * Searches presentations by title or content.
 *
 * @param query - Search query string.
 * @param token - Authentication token.
 *
 * @returns Array of matching presentations.
 */
export async function searchPresentations(
  query: string,
  token: string
): Promise<Presentation[]> {
  const res = await api(token).get<Presentation[]>(
    `/presentation/search?q=${encodeURIComponent(query)}`
  );
  return res.data;
}
