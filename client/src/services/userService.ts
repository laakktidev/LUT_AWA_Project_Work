import axios from "axios";
import { BASE_URL } from "./config";
import { LoginResponse } from "../types/LoginResponse";
import { User } from "../types/User";

/* =======================================================
   SIGN UP USER
   ------------------------------------------------------- */
/**
 * Registers a new user account.
 *
 * @remarks
 * This function:
 * - sends a registration request to the backend
 * - returns the created user object on success
 * - returns `null` if registration fails
 *
 * The backend handles validation (email uniqueness, password rules, etc.).
 *
 * @param email - User's email address.
 * @param password - User's chosen password.
 * @param username - Display name for the new user.
 *
 * @returns The created user object, or `null` if registration failed.
 */
export async function signupUser(
  email: string,
  password: string,
  username: string
) {
  try {
    const response = await axios.post(`${BASE_URL}/user/register`, {
      email,
      password,
      username,
    });

    return response.data;
  } catch (error) {
    console.error("Signup failed:", error);
    return null;
  }
}

/* =======================================================
   LOGIN USER
   ------------------------------------------------------- */
/**
 * Authenticates a user and retrieves a JWT token.
 *
 * @remarks
 * This function:
 * - sends login credentials to the backend
 * - returns a `LoginResponse` containing token + user info
 * - returns `null` if authentication fails
 *
 * @param email - User's email address.
 * @param password - User's password.
 *
 * @returns A `LoginResponse` object or `null` on failure.
 */
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

/* =======================================================
   GET ALL USERS
   ------------------------------------------------------- */
/**
 * Fetches all users from the backend.
 *
 * @remarks
 * Requires authentication.  
 * Typically used for:
 * - sharing documents/presentations
 * - admin or collaboration features
 *
 * @param token - Authentication token.
 *
 * @returns Array of `User` objects.
 */
export async function getUsers(token: string): Promise<User[]> {
  const response = await axios.get<User[]>(
    `${BASE_URL}/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

/* =======================================================
   UPLOAD PROFILE PICTURE
   ------------------------------------------------------- */
/**
 * Uploads a new profile picture for the authenticated user.
 *
 * @remarks
 * This function:
 * - sends a multipart/form-data request
 * - requires authentication
 * - returns the updated user profile or image metadata
 *
 * @param formData - FormData containing the image file.
 * @param token - Authentication token.
 *
 * @returns Backend response containing uploaded image info.
 */
export async function uploadProfilePicture(
  formData: FormData,
  token: string
) {
  const res = await axios.post(
    `${BASE_URL}/user/profile-picture`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log("res.data:", res.data);
  return res.data;
}
