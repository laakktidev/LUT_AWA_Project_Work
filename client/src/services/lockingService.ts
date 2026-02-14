import axios from "axios";
import { BASE_URL } from "./config";

/* =======================================================
   LOCK DOCUMENT
   ------------------------------------------------------- */
/**
 * Locks a document to prevent concurrent editing.
 *
 * @remarks
 * This function:
 * - sends a lock request to the backend
 * - requires a valid authentication token
 * - returns `true` on success
 * - throws a specific error when the backend responds with HTTP 423 (Locked)
 *
 * Locking is typically used when a user opens a document editor to ensure
 * no other user can modify the same document simultaneously.
 *
 * @param docId - ID of the document to lock.
 * @param token - Authentication token.
 *
 * @returns `true` if the document was successfully locked.
 *
 * @throws Error when:
 * - the backend returns HTTP 423 (document already locked)
 * - any other network or server error occurs
 */
export async function lockDocument(docId: string, token: string) {
  try {
    await axios.post(
      `${BASE_URL}/documentLock/${docId}/lock`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return true;
  } catch (err: any) {
    if (err.response?.status === 423) {
      throw new Error(err.response.data.message);
    }

    throw new Error("Failed to lock document");
  }
}

/* =======================================================
   UNLOCK DOCUMENT
   ------------------------------------------------------- */
/**
 * Unlocks a previously locked document.
 *
 * @remarks
 * This function:
 * - sends an unlock request to the backend
 * - requires a valid authentication token
 * - returns `true` on success
 * - returns `false` on failure (unlock errors should not break the UI)
 *
 * Unlocking is typically called when the user closes the editor or navigates away.
 *
 * @param docId - ID of the document to unlock.
 * @param token - Authentication token.
 *
 * @returns `true` if unlock succeeded, otherwise `false`.
 */
export async function unlockDocument(docId: string, token: string) {
  try {
    await axios.post(
      `${BASE_URL}/documentLock/${docId}/unlock`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return true;
  } catch (err: any) {
    // Unlock failures should not break the UI
    console.warn("Unlock failed:", err.response?.data || err.message);
    return false;
  }
}
