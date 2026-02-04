import { Presentation } from "../types/Presentation";

import axios from "axios";

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

/*export async function getPresentation(
  id: string,
  token: string
): Promise<Presentation> {
  const res = await api(token).get<Presentation>(`/presentation/${id}`);
  return res.data;
}*/

export async function getPresentationById(
  id: string,
  token: string
): Promise<Presentation> {
  const res = await api(token).get<Presentation>(`/presentation/${id}`);
  return res.data;
}



export async function getPresentations(
  token: string
): Promise<Presentation[]> {
  const res = await api(token).get<Presentation[]>(`/presentation`);
  return res.data;
}


export async function createPresentation(
  payload: Partial<Presentation>,
  token: string
): Promise<Presentation> {
  const res = await api(token).post<Presentation>(`/presentation`, payload);
  return res.data;
}

export async function updatePresentation(
  id: string,
  payload: Partial<Presentation>,
  token: string
): Promise<Presentation> {
  const res = await api(token).patch<Presentation>(`/presentation/${id}`, payload);
  return res.data;
}

export async function deletePresentation(
  id: string,
  token: string
): Promise<void> {
  await api(token).delete(`/presentation/${id}`);
}

/* -------------------------------------------------------
   SHARE DOCUMENT (ADD EDITORS)
------------------------------------------------------- */
export async function sharePresentation(
  representionId: string,
  userIds: string[],
  token: string
) {
  const response = await axios.patch(
    `${BASE_URL}/presentation/${representionId}/editors`,
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

/* ----------------------------------------
   SEARCH PRESENTATIONS
-----------------------------------------*/
export async function searchPresentations(
  query: string,
  token: string
): Promise<Presentation[]> {
  const res = await api(token).get<Presentation[]>(
    `/presentation/search?q=${encodeURIComponent(query)}`
  );
  return res.data;
}
