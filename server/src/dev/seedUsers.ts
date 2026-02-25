    import { Router } from "express";
import bcrypt from "bcrypt";
import {User} from "../models/User";

const router = Router();

router.post("/seed-users", async (req, res) => {
  const names = [
    "Mikko", "Jenna", "Aleksi", "Veera", "Oskari",
    "Sanni", "Elias", "Aino", "Onni", "Helmi",
    "Lauri", "Emma", "Kalle", "Sara", "Jere",
    "Noora", "Tuomas", "Iida", "Roope", "Ella"
  ];

  
  const users = names.map((name, i) => ({
    username: name,
    email: `${name.toLowerCase()}@example.com`,
    password: "Password123!"
  }));

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({
      username: u.username,
      email: u.email,
      password: hashed
    });
  }

  res.json({ message: "20 users created" });
});

export default router;
