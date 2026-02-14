import axios from "axios";
import { Document } from "../types/Document";
import { BASE_URL } from "./config";

export interface CreateDocumentInput {
  /** Title of the document. */
  title: string;

  /** Main content of the document. */
  content: string;
}

/* =======================================================
   CREATE DOCUMENT
   ------------------------------------------------------- */
/**
 * Creates a new document owned by the authenticated user.
 *
 * @param data - Document title and content.
 * @param token - Authentication token.
 * @returns The newly created document.
 */
export async function createDocument(
  data: CreateDocumentInput,
  token: string
): Promise<Document> {
  const response = await axios.post<Document>(
    `${BASE_URL}/document`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

/* =======================================================
   GET SINGLE DOCUMENT
   ------------------------------------------------------- */
/**
 * Fetches a single document by ID.
 *
 * @param id - Document ID.
 * @param token - Authentication token.
 * @returns The requested document.
 */
export async function getDocumentById(
  id: string,
  token: string
): Promise<Document> {
  const response = await axios.get<Document>(
    `${BASE_URL}/document/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
}

/* =======================================================
   GET ALL DOCUMENTS (owner OR editor)
   ------------------------------------------------------- */
/**
 * Fetches all documents the user owns or can edit.
 *
 * @param token - Authentication token.
 * @returns Array of documents.
 */
export async function getDocuments(token: string): Promise<Document[]> {
  const response = await axios.get<Document[]>(
    `${BASE_URL}/document`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
}

/* =======================================================
   UPDATE DOCUMENT (OWNER ONLY)
   ------------------------------------------------------- */
/**
 * Updates a document's title or content.
 *
 * @remarks
 * Only the document owner is allowed to update it.
 *
 * @param id - Document ID.
 * @param data - Partial update payload.
 * @param token - Authentication token.
 * @returns The updated document.
 */
export async function updateDocument(
  id: string,
  data: Partial<CreateDocumentInput>,
  token: string
): Promise<Document> {
  const response = await axios.put<Document>(
    `${BASE_URL}/document/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

/* =======================================================
   DELETE DOCUMENT (OWNER ONLY)
   ------------------------------------------------------- */
/**
 * Permanently deletes a document.
 *
 * @param id - Document ID.
 * @param token - Authentication token.
 * @returns Nothing (void).
 */
export async function deleteDocument(
  id: string,
  token: string
): Promise<void> {
  const response = await axios.delete(
    `${BASE_URL}/document/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
}

/* =======================================================
   SHARE DOCUMENT (ADD EDITORS)
   ------------------------------------------------------- */
/**
 * Adds users as editors to a document.
 *
 * @param documentId - Document ID.
 * @param userIds - Array of user IDs to grant edit access.
 * @param token - Authentication token.
 * @returns Updated editor list or document metadata.
 */
export async function shareDocument(
  documentId: string,
  userIds: string[],
  token: string
) {
  const response = await axios.patch(
    `${BASE_URL}/document/${documentId}/editors`,
    { userIds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

/* =======================================================
   UPDATE PUBLIC VISIBILITY
   ------------------------------------------------------- */
/**
 * Updates whether a document is publicly accessible.
 *
 * @remarks
 * - Throws a specific error if the backend returns HTTP 423 (Locked).
 *
 * @param documentId - Document ID.
 * @param isPublic - Whether the document should be public.
 * @param token - Authentication token.
 * @returns Updated visibility state.
 */
export async function updateDocumentVisibility(
  documentId: string,
  isPublic: boolean,
  token: string
) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/document/${documentId}/public`,
      { isPublic },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (err: any) {
    if (err.response?.status === 423) {
      throw new Error(err.response.data.message);
    }

    throw new Error("Failed to update document visibility");
  }
}

/* =======================================================
   SOFT DELETE / RESTORE
   ------------------------------------------------------- */
/**
 * Moves a document to the trash (soft delete).
 *
 * @param id - Document ID.
 * @param token - Authentication token.
 * @returns Updated document metadata.
 */
export async function softDeleteDocument(id: string, token: string) {
  const res = await axios.patch(
    `${BASE_URL}/document/${id}/soft-delete`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

/**
 * Restores a soft‑deleted document.
 *
 * @param id - Document ID.
 * @param token - Authentication token.
 * @returns Updated document metadata.
 */
export async function restoreDocument(id: string, token: string) {
  const res = await axios.patch(
    `${BASE_URL}/document/${id}/restore`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

/* =======================================================
   TRASH OPERATIONS
   ------------------------------------------------------- */
/**
 * Fetches all documents currently in the trash.
 *
 * @param token - Authentication token.
 * @returns Array of trashed documents.
 */
export async function getTrashDocuments(token: string) {
  const res = await axios.get(`${BASE_URL}/document/trash`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}

/**
 * Returns the number of documents in the trash.
 *
 * @param token - Authentication token.
 * @returns Count of trashed documents.
 */
export async function getTrashCount(token: string) {
  const res = await axios.get(`${BASE_URL}/document/trash/count`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.count;
}

/**
 * Permanently deletes all trashed documents.
 *
 * @param token - Authentication token.
 * @returns Backend response payload.
 */
export async function emptyTrash(token: string) {
  const res = await axios.delete(
    `${BASE_URL}/document/trash/empty`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

/* =======================================================
   CLONE DOCUMENT
   ------------------------------------------------------- */
/**
 * Creates a duplicate of an existing document.
 *
 * @param id - Document ID to clone.
 * @param token - Authentication token.
 * @returns The cloned document.
 */
export async function cloneDocument(id: string, token: string) {
  const res = await axios.post(
    `${BASE_URL}/document/${id}/clone`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

/* =======================================================
   SEARCH DOCUMENTS
   ------------------------------------------------------- */
/**
 * Searches documents by title or content.
 *
 * @param search - Search query string.
 * @param token - Authentication token.
 * @returns Array of matching documents.
 */
export async function searchDocuments(search: string, token: string) {
  const res = await axios.get(
    `${BASE_URL}/document/search`,
    {
      params: { q: search },
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

/* =======================================================
   PDF DOWNLOAD
   ------------------------------------------------------- */
/**
 * Downloads a PDF version of a document.
 *
 * @param id - Document ID.
 * @param token - Authentication token.
 * @returns A Blob representing the PDF file.
 */
export async function downloadPdf(id: string, token: string) {
  const res = await axios.get(`${BASE_URL}/document/${id}/pdf`, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}

/* =======================================================
   IMAGE UPLOAD
   ------------------------------------------------------- */
/**
 * Uploads an image to a document.
 *
 * @param documentId - Document ID.
 * @param file - Image file to upload.
 * @param token - Authentication token.
 * @returns The URL of the uploaded image.
 */
export async function uploadDocumentImage(
  documentId: string,
  file: File,
  token: string
): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(
    `${BASE_URL}/document/${documentId}/images`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.url;
}
