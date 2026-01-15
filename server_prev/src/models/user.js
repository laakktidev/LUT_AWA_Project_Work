"use strict";
/*
import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// In‑memory user list
interface IUser {
    email: string;
    password: string; // hashed
}

const users: IUser[] = [];

router.post("/register",
    body("email").isEmail(),
    body("password").isLength({ min: 4 }),
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check duplicate email
        const existing = users.find(u => u.email === email);
        if (existing) {
            return res.status(403).json({ message: "Email already in use" });
        }

        // Hash password
        const hash = bcrypt.hashSync(password, 10);

        const newUser: IUser = { email, password: hash };
        users.push(newUser);

        return res.status(200).json(newUser);
    }
);


router.post(
    "/login",
    body("email").isEmail(),
    body("password").exists(),
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user in the in‑memory list
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: "Login failed" });
        }

        // Compare password
        const match = bcrypt.compareSync(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Login failed" });
        }

        // Create JWT token with email in payload
        const token = jwt.sign(
            { email: user.email },
            process.env.SECRET as string,
            { expiresIn: "2m" }
        );

        return res.status(200).json({ success: true, token });
    }
);



// ---------------------- LIST USERS ----------------------
router.get("/list", (req: Request, res: Response) => {
    return res.status(200).json(users);
});

export default router;*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const inputValidation_1 = require("../middleware/inputValidation");
const router = (0, express_1.Router)();
// ---------------------- REGISTER ----------------------
router.post("/register", inputValidation_1.registerValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, username, isAdmin } = req.body;
    // Check duplicate email
    const existing = await User_1.User.findOne({ email });
    if (existing) {
        return res.status(403).json({ message: "Email already in use" });
    }
    // Hash password
    const hashed = await bcrypt_1.default.hash(password, 10);
    const newUser = new User_1.User({
        email,
        username,
        password: hashed,
        isAdmin: isAdmin ?? false
    });
    await newUser.save();
    return res.json(newUser);
});
// ---------------------- LOGIN ----------------------
router.post("/login", inputValidation_1.loginValidation, async (req, res) => {

    const errors = (0, express_validator_1.validationResult)(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    // Find user
    const user = await User_1.User.findOne({ email });
    
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // Compare password
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ message: "Incorrect password" });
    }
    // Create JWT token
    const token = jsonwebtoken_1.default.sign({
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin
    }, process.env.SECRET, { expiresIn: "2m" });
    
    return res.status(200).json({ token });
});
// ---------------------- LIST USERS ----------------------
router.get("/list", async (req, res) => {
    const all = await User_1.User.find();
    return res.status(200).json(all);
});
exports.default = router;
