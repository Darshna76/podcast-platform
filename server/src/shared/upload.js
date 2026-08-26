import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(
  __dirname,
  "..",
  process.env.UPLOAD_DIR || "uploads",
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|mp3|wav|m4a|aac|ogg/;
  const isValid =
    allowed.test(file.mimetype) ||
    allowed.test(path.extname(file.originalname).toLowerCase());
  cb(isValid ? null : new Error("Unsupported file type"), isValid);
};

const upload = multer({ storage, fileFilter });

export default upload;
