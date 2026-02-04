import axios from "axios";

export async function getAllItems(token: string) {
  const res = await axios.get("/api/items", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // { documents, slides }
}
