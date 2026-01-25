import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}

export async function registerUserInDb(email: string, password: string, username: string) {
  const hashed = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hashed,
    username
  });

  return newUser.save();
}

export async function validatePassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed);
}

export function createJwtToken(user: any) {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username
    },
    process.env.SECRET as string,
    { expiresIn: "1h" }
  );
}
