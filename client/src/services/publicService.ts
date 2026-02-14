import axios from "axios";
import { Document } from "../types/Document";
import { BASE_URL } from "./config";

/* =======================================================
   GET PUBLIC DOCUMENT (NO AUTH REQUIRED)
   ------------------------------------------------------- */
/**
 * Fetches a publicly accessible document by ID.
 *
 * @remarks
 * This endpoint does not require authentication and is used for:
 * - public sharing links
 * - read‑only document previews
 * - external access without login
 *
 * The backend determines whether the document is public.  
 * If the document is not public, the request will fail with an error.
 *
 * @param id - The ID of the public document to fetch.
 *
 * @returns A Promise resolving to the public `Document` object.
 *
 * @throws Error if the document does not exist or is not publicly accessible.
 */
export async function getPublicDocumentById(id: string): Promise<Document> {
  const response = await axios.get<Document>(
    `${BASE_URL}/../public/document/${id}`
  );

  console.log("Public document response:", response.data);
  return response.data;
}
