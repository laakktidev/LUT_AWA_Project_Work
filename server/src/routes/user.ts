import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
//import User, { IUser } from "../models/User";
import { authenticateUser } from "../middleware/validateToken";

import { registerValidation, loginValidation } from "../middleware/inputValidation";


const router = Router();

// ---------------------- REGISTER ----------------------
router.post(
    "/register",
    registerValidation,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //const { email, password, username, isAdmin } = req.body;
        const { email, password, username } = req.body;

        // Check duplicate email
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(403).json({ message: "Email already in use" });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashed,
            username
        });

        await newUser.save();

        return res.status(201).json({ email: email });
    }
);

// ---------------------- LOGIN ----------------------
router.post(
    "/login",
    loginValidation,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;


            /////////////////////////////////////////////////////////////////
            // seuraavat pitäi ehkä olla email or password is incorrect!!!!!!
            /////////////////////////////////////////////////////////////////

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Compare password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ message: "Incorrect password" });
            }

            // Create JWT token
            const token = jwt.sign(
                {
                    _id: user._id,
                    username: user.username,
                    //  isAdmin: user.isAdmin
                },
                process.env.SECRET as string,
                { expiresIn: "1h" }
            );
            return res.status(200).json({ token: token, user: { id: user._id, email: user.email, username: user.username } });
        } catch (error) {
            console.log(error, "-----");
            return res.status(666).json("JOTAIN VIKKOO")
        }

    }
);

// ---------------------- LIST USERS ----------------------
router.get("/", authenticateUser, async (req: Request, res: Response) => {
    const all = await User.find().select({
        _id: 0,
        id: "$_id",
        email: 1,
        username: 1
    });

    return res.status(200).json(all);
});


export default router;