import { Request, Response } from "express";
import { listAllUsers } from "../services/userListService";

export const listUsers = async (req: Request, res: Response) => {
  const users = await listAllUsers();
  return res.status(200).json(users);
};
