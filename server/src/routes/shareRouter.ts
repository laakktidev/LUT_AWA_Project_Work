import { authenticateUser } from "../middleware/validateToken";
import { Router } from "express";
import { sendPublicLink } from "../controllers/shareController";

const router = Router();

/**
 * POST /public-link/:id
 *
 * Sends a public‑access link for a document to a specified email address.
 *
 * @remarks
 * - Requires authentication.
 * - The controller handles:
 *   - permission checks (only owners can share)
 *   - generating the public URL
 *   - sending the email via the email service
 *
 * This route does not expose any sensitive document data directly.
 *
 * @route POST /share/public-link/:id
 */
router.post("/public-link/:id", authenticateUser, sendPublicLink);

export default router;
