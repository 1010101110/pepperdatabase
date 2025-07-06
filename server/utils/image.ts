import formidable, { IncomingForm, File } from "formidable";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import type { H3Event } from "h3";
import { link } from "fs";

interface UploadResult {
  success: boolean;
  filename?: string;
  url?: string;
  error?: string;
  fields?: formidable.Fields<string>;
}

export async function handleImageUpload(
  event: H3Event,
  options?: {
    folder?: string; // e.g. 'avatars', 'xaccession', etc.
    filename?: string; // optional custom name (without extension)
  },
): Promise<UploadResult> {
  const folder = options?.folder || "uploads";
  const uploadDir = path.resolve("/var/www/data/images", folder);

  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (e) {
    console.error("Failed to create upload directory:", e);
    return { success: false, error: "Failed to create upload directory" };
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });
  let fields;
  let files;

  try {
    [fields, files] = await form.parse(event.node.req);
  } catch (e) {
    console.error("Failed to parse form:", e);
    return { success: false, error: "Failed to parse form" };
  }

  const filename = options?.filename || fields?.filename || `${Date.now()}`;
  const outputPath = path.join(uploadDir, `${filename}.webp`);

  if (files.image && files.image.length > 0) {
    const uploaded = files.image[0];
    try {
      await sharp(uploaded.filepath).webp({ quality: 80 }).toFile(outputPath);
      console.log("upload: " + outputPath);

      return {
        success: true,
        fields: fields,
        filename: `${filename}.webp`,
        url: `https://pepperdatabase.org/images/${folder}/${filename}.webp`,
      };
    } catch (e) {
      console.error("Image processing failed:", e);
      return { success: false, error: "Image processing failed" };
    } finally {
      if (uploaded) {
        fs.unlink(uploaded.filepath);
      }
    }
  }

  if (fields.link) {
    const link = Array.isArray(fields.link) ? fields.link[0] : fields.link;
    try {
      const buff = await downloadImage(link);
      await sharp(buff).webp({ quality: 80 }).toFile(outputPath);
      console.log("upload: " + outputPath);

      return {
        success: true,
        fields: fields,
        filename: `${filename}.webp`,
        url: `https://pepperdatabase.org/images/${folder}/${filename}.webp`,
      };
    } catch {
      return { success: false, error: "failed to upload image link" };
    }
  }

  return { success: false };
}

async function downloadImage(imageUrl: string) {
  const res = await fetch(imageUrl);

  if (!res.ok || !res.body) {
    throw new Error(`Failed to fetch image from URL: ${imageUrl}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`URL is not an image: ${contentType}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

export async function deleteImage(img: string) {
  const uploadDir = path.resolve("/var/www/data/");
  const imgnohost = img.replace('https://pepperdatabase.org','');
  const filepath = path.join(uploadDir, imgnohost);
  fs.unlink(filepath);
  console.log("deleted: " + filepath);
}
