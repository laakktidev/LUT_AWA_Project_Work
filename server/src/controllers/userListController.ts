import { Request, Response } from "express";
import { listAllUsers } from "../services/userListService";

/**
 * Retrieves a list of all users in the system.
 *
 * @remarks
 * This controller:
 * - calls `listAllUsers` from the service layer
 * - returns the full user list as JSON
 *
 * It is typically used for:
 * - admin dashboards
 * - sharing dialogs
 * - autocomplete user search
 *
 * No authentication or permission logic is included here; access control
 * should be enforced at the routing or middleware level.
 *
 * @param req - Express request object.
 * @param res - Express response returning the list of users.
 *
 * @returns A JSON array of user objects.
 */
export const listUsers = async (req: Request, res: Response) => {
  const users = await listAllUsers();
  return res.status(200).json(users);
};
