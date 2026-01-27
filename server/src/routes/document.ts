import { Router } from "express";
import { authenticateUser } from "../middleware/validateToken";

import {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument
} from "../controllers/documentController";

import {
  getTrash,
  getTrashCountController,
  softDeleteDocument,
  restoreDocument,
  emptyTrash
} from "../controllers/documentTrashController";

import {
  updateEditors,
  updatePublicVisibility
} from "../controllers/documentShareController";

import { cloneDocument } from "../controllers/documentCloneController";

import { searchDocuments } from "../controllers/documentSearchController";

import { uploadDocumentImageController, generatePdf } from "../controllers/documentFileController";
import { uploadDocumentImage } from "../middleware/uploadDocumentImage";

const router = Router();

router.post("/", authenticateUser, createDocument);
router.get("/", authenticateUser, getDocuments);

router.get("/search", authenticateUser, searchDocuments);

router.get("/trash", authenticateUser, getTrash);
router.get("/trash/count", authenticateUser, getTrashCountController);
router.delete("/trash/empty", authenticateUser, emptyTrash);

router.patch("/:id/soft-delete", authenticateUser, softDeleteDocument);
router.patch("/:id/restore", authenticateUser, restoreDocument);

router.get("/:id", authenticateUser, getDocument);
router.put("/:id", authenticateUser, updateDocument);
router.delete("/:id", authenticateUser, deleteDocument);

router.patch("/:id/editors", authenticateUser, updateEditors);
router.patch("/:id/public", authenticateUser, updatePublicVisibility);

router.post("/:id/clone", authenticateUser, cloneDocument);

router.post("/:id/images", authenticateUser, uploadDocumentImage.single("image"), uploadDocumentImageController);
router.get("/:id/pdf", authenticateUser, generatePdf);

export default router;
