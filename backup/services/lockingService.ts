// services/lockingService.ts
import axios from "axios";
import { BASE_URL } from "./config";

export async function lockDocument(docId: string, token: string) {
  try {
    await axios.post(
      `${BASE_URL}/documentLock/${docId}/lock`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
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

export async function unlockDocument(docId: string, token: string) {
  try {
    await axios.post(
      `${BASE_URL}/documentLock/${docId}/unlock`,      
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return true;
  } catch (err: any) {
    // Unlock failures should not break the UI
    console.warn("Unlock failed:", err.response?.data || err.message);
    return false;
  }
}
