import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const buildPagination = (page = 1, limit = 10) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
  };
};

export const removeFileIfExists = (filePath) => {
  if (!filePath) return;
  const absolutePath = path.resolve(
    __dirname,
    "..",
    filePath.replace(/^\/+/, ""),
  );
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

export const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
