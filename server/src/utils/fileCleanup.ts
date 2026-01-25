import fs from "fs";
import path from "path";

export function extractImageUrls(html: string): string[] {
  const regex = /<img[^>]+src="([^">]+)"/g;
  const urls: string[] = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

export function safeDelete(filePath: string) {

  try {
    console.log("images DELETE____________xxx ",filePath);
    if (fs.existsSync(filePath)) {
      
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("Failed to delete file:", filePath, err);
  }
}
