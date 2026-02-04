import axios from "axios";
import { Document } from "../types/Document";

export interface CreateDocumentInput {
  title: string;
  content: string;
}

import { BASE_URL } from "./config";

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

export async function getDocumentById(
  id: string,
  token: string
): Promise<Document> {
  //console.log("xxxxxxxxxxxxxxxxxxxx   ",token);
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

export async function getDocuments(token: string): Promise<Document[]> {
  const response = await axios.get<Document[]>(
    `${BASE_URL}/document`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  
console.log("Fetched documents:", response.data);

  return response.data;
}
  
export async function shareDocument(
  documentId: string,
  userIds: string[],
  token: string
) {

  //console.log(`${BASE_URL}/document/${documentId}/editors`);
  const response = await axios.patch(
    `${BASE_URL}/document/${documentId}/editors`,
    {      
      userIds      
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("Share document response:", response.status);
  return response.data;
}

export const updateDocumentVisibility = async (
  documentId: string,
  isPublic: boolean,
  token: string
) => {

  try {
  const response = await axios.put(
    `${BASE_URL}/document/${documentId}/public`,
    { isPublic },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
} catch (err: any) {
    if (err.response?.status === 423) {
      throw new Error(err.response.data.message);
    }

    throw new Error("Failed to xxxxx document");
  }
}