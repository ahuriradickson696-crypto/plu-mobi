import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

export async function saveDataUrl(dataUrl) {
  if (typeof dataUrl !== "string" || dataUrl.indexOf("data:image/") !== 0) return null;
  const m = dataUrl.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!m) return null;
  const ext = m[1] === "jpeg" ? "jpg" : m[1];
  const buf = Buffer.from(m[2], "base64");
  return saveBuffer(buf, ext);
}

export async function saveBuffer(buffer, ext) {
  if (!ext) ext = "jpg";
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = crypto.randomUUID() + "." + ext;
  await fs.writeFile(path.join(UPLOAD_DIR, name), buffer);
  return "/uploads/" + name;
}

export async function deleteUpload(photoUrl) {
  if (!photoUrl || photoUrl.indexOf("/uploads/") !== 0) return;
  const filename = photoUrl.replace("/uploads/", "");
  const fullPath = path.join(UPLOAD_DIR, filename);
  try { await fs.unlink(fullPath); } catch (e) {}
}
