import { Router } from "express";
import { authenticateUser } from "../middleware/validateToken";
import { lockDocument, unlockDocument } from "../controllers/documentLockController";

const router = Router();

// Lock document
router.post("/:id/lock", authenticateUser, lockDocument);

// Unlock document
router.post("/:id/unlock", authenticateUser, unlockDocument);

export default router;
