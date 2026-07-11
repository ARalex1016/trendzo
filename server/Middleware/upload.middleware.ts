import multer from "multer";

// Config
import { uploadConfig } from "../Config/upload.config.ts";

const storage = multer.memoryStorage();

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (!uploadConfig.allowedImageTypes.includes(file.mimetype)) {
    return cb(new Error("Only jpg, png and webp images are allowed"));
  }

  cb(null, true);
};

export const upload = multer({
  // uploadProductImages
  storage,
  fileFilter,
  limits: {
    fileSize: uploadConfig.maxFileSize,
    files: uploadConfig.maxFiles,
  },
});
