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

import {
  uploadDocumentImageController,
  generatePdf
} from "../controllers/documentFileController";

import { uploadDocumentImage } from "../middleware/uploadDocumentImage";

const router = Router();

/**
 * POST /
 *
 * Creates a new document.
 *
 * @remarks
 * Requires authentication. The controller handles validation and
 * default values.
 *
 * @route POST /documents
 */
router.post("/", authenticateUser, createDocument);

/**
 * GET /
 *
 * Retrieves all documents accessible to the authenticated user.
 *
 * @remarks
 * Includes owned and shared documents. Excludes soft‑deleted items.
 *
 * @route GET /documents
 */
router.get("/", authenticateUser, getDocuments);

/**
 * GET /search
 *
 * Searches documents by title or content.
 *
 * @remarks
 * Requires authentication. Search is case‑insensitive.
 *
 * @route GET /documents/search
 */
router.get("/search", authenticateUser, searchDocuments);

/* -----------------------------
   Trash Management
------------------------------*/

/**
 * GET /trash
 *
 * Retrieves all soft‑deleted documents for the user.
 *
 * @route GET /documents/trash
 */
router.get("/trash", authenticateUser, getTrash);

/**
 * GET /trash/count
 *
 * Returns the number of items in the user's trash.
 *
 * @route GET /documents/trash/count
 */
router.get("/trash/count", authenticateUser, getTrashCountController);

/**
 * DELETE /trash/empty
 *
 * Permanently deletes all soft‑deleted documents.
 *
 * @route DELETE /documents/trash/empty
 */
router.delete("/trash/empty", authenticateUser, emptyTrash);

/**
 * PATCH /:id/soft-delete
 *
 * Soft‑deletes a document (moves it to trash).
 *
 * @route PATCH /documents/:id/soft-delete
 */
router.patch("/:id/soft-delete", authenticateUser, softDeleteDocument);

/**
 * PATCH /:id/restore
 *
 * Restores a soft‑deleted document.
 *
 * @route PATCH /documents/:id/restore
 */
router.patch("/:id/restore", authenticateUser, restoreDocument);

/* -----------------------------
   CRUD
------------------------------*/

/**
 * GET /:id
 *
 * Retrieves a single document owned or shared with the user.
 *
 * @route GET /documents/:id
 */
router.get("/:id", authenticateUser, getDocument);

/**
 * PUT /:id
 *
 * Updates a document.
 *
 * @route PUT /documents/:id
 */
router.put("/:id", authenticateUser, updateDocument);

/**
 * DELETE /:id
 *
 * Permanently deletes a document.
 *
 * @route DELETE /documents/:id
 */
router.delete("/:id", authenticateUser, deleteDocument);

/* -----------------------------
   Sharing
------------------------------*/

/**
 * PATCH /:id/editors
 *
 * Updates the list of editors for a document.
 *
 * @remarks
 * Only the owner may modify editors.
 *
 * @route PATCH /documents/:id/editors
 */
router.patch("/:id/editors", authenticateUser, updateEditors);

/**
 * PATCH /:id/public
 *
 * Updates the public visibility of a document.
 *
 * @route PATCH /documents/:id/public
 */
router.patch("/:id/public", authenticateUser, updatePublicVisibility);

/* -----------------------------
   Cloning
------------------------------*/

/**
 * POST /:id/clone
 *
 * Creates a duplicate of a document.
 *
 * @route POST /documents/:id/clone
 */
router.post("/:id/clone", authenticateUser, cloneDocument);

/* -----------------------------
   File Uploads & PDF Export
------------------------------*/

/**
 * POST /:id/images
 *
 * Uploads an image to be embedded in a document.
 *
 * @remarks
 * Uses Multer middleware to handle file uploads.
 *
 * @route POST /documents/:id/images
 */
router.post(
  "/:id/images",
  authenticateUser,
  uploadDocumentImage.single("image"),
  uploadDocumentImageController
);

/**
 * GET /:id/pdf
 *
 * Generates a PDF version of the document.
 *
 * @route GET /documents/:id/pdf
 */
router.get("/:id/pdf", authenticateUser, generatePdf);

export default router;
