import axios from "axios";
import { Document } from "../types/Document";

//const BASE_URL = import.meta.env.VITE_API_URL;
import { BASE_URL } from "./config";

// Fetch a public document (no token required)
export async function getPublicDocumentById(id: string): Promise<Document> {
  const response = await axios.get<Document>(`${BASE_URL}/public/document/${id}`);
  return response.data;
}
