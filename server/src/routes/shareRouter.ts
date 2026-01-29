import { authenticateUser } from "../middleware/validateToken";

import { Router } from "express";
import { sendPublicLink } from "../controllers/shareController";

const router = Router();

router.post("/public-link/:id", authenticateUser, sendPublicLink);

export default router;
