import { Router } from "express";
import { getPublicDocument } from "../controllers/documentPublicController";

const router = Router();

/**
 * GET /document/:id
 *
 * Retrieves a publicly accessible document.
 *
 * @remarks
 * This route:
 * - does **not** require authentication
 * - is used for sharing documents via public links
 * - relies on the controller to enforce visibility rules (`isPublic`)
 *
 * If the document is not public, the controller will return an appropriate
 * error response.
 *
 * @route GET /public/document/:id
 */
router.get("/document/:id", getPublicDocument);

export default router;
