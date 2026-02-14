import { Router } from "express";
import { authenticateUser } from "../middleware/validateToken";
import { lockDocument, unlockDocument } from "../controllers/documentLockController";

const router = Router();

/**
 * POST /:id/lock
 *
 * Applies an edit lock to a document.
 *
 * @remarks
 * - Requires authentication.
 * - The controller ensures that only one user can lock a document at a time.
 * - Locking prevents concurrent edits and race conditions.
 *
 * @route POST /documents/:id/lock
 */
router.post("/:id/lock", authenticateUser, lockDocument);

/**
 * POST /:id/unlock
 *
 * Removes an edit lock from a document.
 *
 * @remarks
 * - Requires authentication.
 * - The controller ensures that only the lock owner can unlock the document.
 *
 * @route POST /documents/:id/unlock
 */
router.post("/:id/unlock", authenticateUser, unlockDocument);

export default router;
