import { Router } from "express";
import { getPublicDocument } from "../controllers/documentPublicController";

const router = Router();

router.get("/document/:id", getPublicDocument);

export default router;
