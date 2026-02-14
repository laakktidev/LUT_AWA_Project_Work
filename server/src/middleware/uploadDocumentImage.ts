import multer from "multer";
import path from "path";
import fs from "fs";

const documentsDir = "uploads/documents";

// Ensure the upload directory exists
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

/**
 * Multer storage configuration for document‑embedded images.
 *
 * @remarks
 * This storage engine:
 * - saves files into `uploads/documents`
 * - generates a unique filename using:
 *   - current timestamp
 *   - a random number
 *   - the original file extension
 *
 * This prevents filename collisions and ensures each uploaded image
 * receives a unique, traceable name.
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, documentsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

/**
 * Multer instance for handling document image uploads.
 *
 * @remarks
 * This middleware is typically used in routes like:
 * ```ts
 * router.post("/upload-image", uploadDocumentImage.single("image"), uploadDocumentImageController);
 * ```
 *
 * No file filtering is applied here — validation is handled at the controller level.
 */
export const uploadDocumentImage = multer({ storage });
