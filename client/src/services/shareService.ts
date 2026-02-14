import axios from "axios";
import { BASE_URL } from "./config";

/* =======================================================
   SEND PUBLIC LINK VIA EMAIL
   ------------------------------------------------------- */
/**
 * Sends a public document link to a recipient via email.
 *
 * @remarks
 * This endpoint:
 * - requires authentication
 * - sends an email containing a public‑access link to a document
 * - is typically used when a user wants to share a document without granting edit access
 *
 * The backend handles email delivery and validation of the document's public status.
 *
 * @param docId - ID of the document whose public link will be shared.
 * @param email - Recipient's email address.
 * @param token - Authentication token.
 *
 * @returns A Promise resolving to the backend response.
 *
 * @example
 * ```ts
 * await sendPublicLink("abc123", "friend@example.com", token);
 * ```
 */
export async function sendPublicLink(
  docId: string,
  email: string,
  token: string
) {
  return axios.post(
    `${BASE_URL}/share/public-link/${docId}`,
    { email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
