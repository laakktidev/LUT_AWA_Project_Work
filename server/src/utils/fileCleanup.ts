import fs from "fs";
import path from "path";

/* =======================================================
   EXTRACT IMAGE URLS FROM HTML
   ------------------------------------------------------- */
/**
 * Extracts all image URLs from an HTML string.
 *
 * @remarks
 * This function:
 * - scans the HTML for `<img>` tags
 * - extracts the value of the `src` attribute
 * - returns an array of all discovered URLs
 *
 * It uses a global RegExp to iterate through all matches.
 *
 * @param html - The raw HTML string to parse.
 *
 * @returns An array of image URLs found in the HTML.
 *
 * @example
 * ```ts
 * const urls = extractImageUrls('<img src="/uploads/a.png" />');
 * // → ['/uploads/a.png']
 * ```
 */
export function extractImageUrls(html: string): string[] {
  const regex = /<img[^>]+src="([^">]+)"/g;
  const urls: string[] = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

/* =======================================================
   SAFE FILE DELETE
   ------------------------------------------------------- */
/**
 * Safely deletes a file from the filesystem.
 *
 * @remarks
 * This function:
 * - checks whether the file exists before attempting deletion
 * - wraps the deletion in a try/catch to avoid crashing the server
 * - logs an error if deletion fails
 *
 * It is typically used for cleaning up uploaded images or temporary files.
 *
 * @param filePath - Absolute or relative path to the file to delete.
 *
 * @returns void
 *
 * @example
 * ```ts
 * safeDelete('/uploads/image.png');
 * ```
 */
export function safeDelete(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("Failed to delete file:", filePath, err);
  }
}
