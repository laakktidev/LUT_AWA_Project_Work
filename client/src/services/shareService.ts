import axios from "axios";
import { BASE_URL } from "./config";

export async function sendPublicLink(docId: string, email: string, token: string) {
  
    //console.log(`${BASE_URL}/share/public-link/${docId}, ${email}, ${token}`);
    //return null;

    return axios.post(
    `${BASE_URL}/share/public-link/${docId}`,
    { email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}


