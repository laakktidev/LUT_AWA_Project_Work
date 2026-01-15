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


// POST http://localhost:8000/api/document/6964c75196e37f450b88c0fb/editors
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

