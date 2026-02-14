import multer from "multer";
import path from "path";

/**
 * Multer storage configuration for profile‑picture uploads.
 *
 * @remarks
 * This storage engine:
 * - saves files into `uploads/profile-picture`
 * - names each file using the authenticated user's ID
 * - preserves the original file extension
 *
 * This ensures each user always has exactly one profile picture file,
 * which gets overwritten on subsequent uploads.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-picture");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${req.user?._id}.${ext}`);
  }
});

/**
 * File filter ensuring only image uploads are accepted.
 *
 * @remarks
 * Multer passes the uploaded file's MIME type, allowing us to reject
 * non‑image uploads early. If the file is not an image, Multer receives
 * an error and the request is rejected.
 *
 * @param req - Express request object.
 * @param file - The uploaded file metadata.
 * @param cb - Callback to accept or reject the file.
 */
function fileFilter(req: any, file: Express.Multer.File, cb: any) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {  
    cb(new Error("Only images allowed"), false);
  }
}

/**
 * Multer instance configured for profile‑picture uploads.
 *
 * @remarks
 * Combines:
 * - custom storage engine
 * - image‑only file filter
 *
 * This export is used directly in routes:
 * ```ts
 * router.post("/upload", upload.single("file"), uploadProfilePicture);
 * ```
 */
export const upload = multer({ storage, fileFilter });
