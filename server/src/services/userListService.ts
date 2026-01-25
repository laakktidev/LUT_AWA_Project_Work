import { User } from "../models/User";

export async function listAllUsers() {
  return User.find().select({
    _id: 0,
    id: "$_id",
    email: 1,
    username: 1
  });
}
