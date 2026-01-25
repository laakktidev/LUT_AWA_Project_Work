import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  registerUserInDb,
  findUserByEmail,
  validatePassword,
  createJwtToken
} from "../services/userAuthService";


export const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, username } = req.body;

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(403).json({ message: "Email already in use" });
    }

    await registerUserInDb(email, password, username);

    return res.status(201).json({ email });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await validatePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = createJwtToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
