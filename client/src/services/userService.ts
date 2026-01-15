import axios from "axios";
import { BASE_URL } from "./config";


export async function signupUser(email: string, password: string, username: string) {
  try {
    const response = await axios.post(`${BASE_URL}/user/register`, {
      email,
      password,
      username
    });

    return response.data;
  } catch (error) {
    console.error("Signup failed:", error);
    return null;
  }
}


import { LoginResponse } from "../types/LoginResponse";

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse | null> {
  try {
    const response = await axios.post<LoginResponse>(
      `${BASE_URL}/user/login`,
      { email, password }
    );

    return response.data;

  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

import { User } from "../types/User";

export async function getUsers(token: string): Promise<User[]> {
  const response = await axios.get<User[]>(
    `${BASE_URL}/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}


