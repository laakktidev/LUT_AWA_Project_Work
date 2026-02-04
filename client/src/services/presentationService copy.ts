// src/services/presentationService.ts
import axios from "axios";
import { IPresentation } from "../types/Presentation";
import { BASE_URL } from "./config";

const API_URL = BASE_URL;

/* ----------------------------------------
   Axios instance with auth header support
-----------------------------------------*/
function api(token: string, baseURL: string = API_URL) {
  return axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
}

/* ----------------------------------------
   CREATE PRESENTATION
-----------------------------------------*/
export async function createPresentation(
  payload: Partial<IPresentation>,
  token: string
): Promise<IPresentation> {
  const res = await api(token).post<IPresentation>("/presentation", payload);
  return res.data;
}

/* ----------------------------------------
   UPDATE PRESENTATION
-----------------------------------------*/
export async function updatePresentation(
  id: string,
  payload: Partial<IPresentation>,
  token: string
): Promise<IPresentation> {
  const res = await api(token).put<IPresentation>(`/presentation/${id}`, payload);
  return res.data;
}

/* ----------------------------------------
   GET ONE PRESENTATION
-----------------------------------------*/
export async function getPresentation(
  id: string,
  token: string
): Promise<IPresentation> {
  const res = await api(token).get<IPresentation>(`/presentation/${id}`);
  return res.data;
}

export async function getPresentationById(id: string, token: string) {
  const res = await axios.get(`/api/presentation/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}



/* ----------------------------------------
   GET ALL PRESENTATIONS
-----------------------------------------*/
export async function getPresentations(token: string): Promise<IPresentation[]> {
  const res = await api(token).get<IPresentation[]>("/presentation");
  return res.data;
}

/* ----------------------------------------
   DELETE PRESENTATION (hard delete)
-----------------------------------------*/
export async function deletePresentation(id: string, token: string): Promise<void> {
  await api(token).delete(`/presentation/${id}`);
}

/* ----------------------------------------
   SEARCH PRESENTATIONS
-----------------------------------------*/
export async function searchPresentations(
  query: string,
  token: string
): Promise<IPresentation[]> {
  const res = await api(token).get<IPresentation[]>(
    `/presentation/search?q=${encodeURIComponent(query)}`
  );
  return res.data;
}
