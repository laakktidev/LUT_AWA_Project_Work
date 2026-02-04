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

router.use(authenticateUser);

router.post("/", createPresentation);
router.get("/", getPresentations);
router.get("/:id", getPresentation);
router.patch("/:id", updatePresentation);
router.delete("/:id", deletePresentation);
router.get("/search", searchPresentations);

router.post("/:id/lock", lockPres);
router.post("/:id/unlock", unlockPres);

router.patch("/:id/editors", authenticateUser, updateEditors);


export default router;
