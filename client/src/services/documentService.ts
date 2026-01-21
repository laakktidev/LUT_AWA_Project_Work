  import axios from "axios";
import { Document } from "../types/Document";
import { BASE_URL } from "./config";

export interface CreateDocumentInput {
  title: string;
  content: string;
}

/* -------------------------------------------------------
   CREATE DOCUMENT
------------------------------------------------------- */
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
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}

/* -------------------------------------------------------
   GET SINGLE DOCUMENT
------------------------------------------------------- */
export async function getDocumentById(
  id: string,
  token: string
): Promise<Document> {
  const response = await axios.get<Document>(
    `${BASE_URL}/document/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}

/* -------------------------------------------------------
   GET ALL DOCUMENTS (owner OR editor)
------------------------------------------------------- */
export async function getDocuments(token: string): Promise<Document[]> {
  const response = await axios.get<Document[]>(
    `${BASE_URL}/document`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}


/* -------------------------------------------------------
   UPDATE DOCUMENT (OWNER ONLY)
------------------------------------------------------- */
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
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}

/* -------------------------------------------------------
   DELETE DOCUMENT (OWNER ONLY)
------------------------------------------------------- */
export async function deleteDocument(
  id: string,
  token: string
): Promise<void> {
  const response = await axios.delete(
    `${BASE_URL}/document/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}

/* -------------------------------------------------------
   SHARE DOCUMENT (ADD EDITORS)
------------------------------------------------------- */
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
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}

/* -------------------------------------------------------
   UPDATE PUBLIC VISIBILITY (OWNER ONLY)
------------------------------------------------------- */
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
          "Content-Type": "application/json"
        }
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


export async function softDeleteDocument(id: string, token: string) {

  console.log("xxxxxxxxxxxx ",token);

  const res = await axios.patch(
    `${BASE_URL}/document/${id}/soft-delete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}

export async function restoreDocument(id: string, token: string) {
  const res = await axios.patch(
    `${BASE_URL}/document/${id}/restore`,
    {},
    {
      headers: {  
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}

////////////////////

// Get all deleted documents
export async function getTrashDocuments(token: string) {
  const res = await axios.get(`${BASE_URL}/document/trash`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // array of documents
}

// Get count of deleted documents
export async function getTrashCount(token: string) {
  const res = await axios.get(`${BASE_URL}/document/trash/count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.count; // number
}

//////////////////