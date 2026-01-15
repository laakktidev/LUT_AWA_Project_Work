import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface DecodedUser extends JwtPayload {
  _id: string;
  username: string;  
}

// GLOBAL TYPE AUGMENTATION ei tarvii tehdä tyyppimuutoksia tms. puliveivausta moneen paikkaan
declare global {
  namespace Express {
    interface Request {
      user?: DecodedUser;
    }
  }
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  
  const token = req.header("authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not found." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET as string) as DecodedUser;
    req.user = decoded; // fully typed, no casting needed
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

