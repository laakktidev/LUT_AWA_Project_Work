// routes/presentationRoutes.ts
import { Router } from "express";
import {
  createPresentation,
  getPresentations,
  getPresentation,
  updatePresentation,
  deletePresentation,
  searchPresentations,
  lockPres,
  unlockPres,
  updateEditors
} from "../controllers/presentationController";

import { authenticateUser } from "../middleware/validateToken";

const router = Router();

/**
 * Applies authentication middleware to all presentation routes.
 *
 * @remarks
 * Every route below requires a valid JWT token.
 */
router.use(authenticateUser);

/**
 * POST /
 *
 * Creates a new presentation.
 *
 * @route POST /presentations
 */
router.post("/", createPresentation);

/**
 * GET /
 *
 * Retrieves all presentations owned by the authenticated user.
 *
 * @route GET /presentations
 */
router.get("/", getPresentations);

/**
 * GET /:id
 *
 * Retrieves a single presentation by ID.
 *
 * @remarks
 * Only the owner or an authorized editor may access it.
 *
 * @route GET /presentations/:id
 */
router.get("/:id", getPresentation);

/**
 * PATCH /:id
 *
 * Updates a presentation.
 *
 * @route PATCH /presentations/:id
 */
router.patch("/:id", updatePresentation);

/**
 * DELETE /:id
 *
 * Permanently deletes a presentation.
 *
 * @route DELETE /presentations/:id
 */
router.delete("/:id", deletePresentation);

/**
 * GET /search
 *
 * Searches presentations by title, slide titles, or slide bullet points.
 *
 * @route GET /presentations/search
 */
router.get("/search", searchPresentations);

/* -----------------------------
   Locking
------------------------------*/

/**
 * POST /:id/lock
 *
 * Applies an edit lock to a presentation.
 *
 * @route POST /presentations/:id/lock
 */
router.post("/:id/lock", lockPres);

/**
 * POST /:id/unlock
 *
 * Removes the edit lock from a presentation.
 *
 * @route POST /presentations/:id/unlock
 */
router.post("/:id/unlock", unlockPres);

/* -----------------------------
   Sharing
------------------------------*/

/**
 * PATCH /:id/editors
 *
 * Updates the list of editors for a presentation.
 *
 * @remarks
 * Only the owner may modify the editor list.
 *
 * @route PATCH /presentations/:id/editors
 */
router.patch("/:id/editors", authenticateUser, updateEditors);

export default router;
