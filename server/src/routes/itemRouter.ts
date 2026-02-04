import { Router } from "express";
;
import { authenticateUser } from "../middleware/validateToken";
import { getAllItems } from "../controllers/itemController";

const router = Router();

router.get("/", authenticateUser, getAllItems);

export default router;
