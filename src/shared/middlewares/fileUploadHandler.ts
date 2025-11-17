// src/shared/middlewares/fileUploadHandler.ts
import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import { StatusCodes } from "http-status-codes";
import { logger, errorLogger } from "../utils/logger";

// ============================================
// DIRECTORY SETUP
// ============================================

const uploadDirs = {
  images: path.join(process.cwd(), "uploads", "images"),
  docs: path.join(process.cwd(), "uploads", "docs"),
  medias: path.join(process.cwd(), "uploads", "medias"),
} as const;

// Ensure directories exist
Object.values(uploadDirs).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    logger.info(`Created upload directory: ${dir}`);
  }
});

// ============================================
// CONFIGURATION
// ============================================

const FILE_LIMITS = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxFiles: 20,
  imageOptimizationThreshold: 10 * 1024 * 1024, // 10MB
} as const;

const ALLOWED_MIME_TYPES = {
  images: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  documents: ["application/pdf"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/m4a"],
} as const;

// ============================================
// HELPER: ENSURE SUBFOLDER EXISTS
// ============================================

const ensureSubfolderExists = (subfolder?: string): string => {
  if (!subfolder) return uploadDirs.images;

  // Sanitize subfolder name to prevent directory traversal
  const sanitizedSubfolder = subfolder.replace(/[^a-zA-Z0-9_-]/g, "_");
  const subfolderPath = path.join(uploadDirs.images, sanitizedSubfolder);

  if (!fs.existsSync(subfolderPath)) {
    fs.mkdirSync(subfolderPath, { recursive: true });
    logger.info(`Created subfolder: ${subfolderPath}`);
  }

  return subfolderPath;
};

// ============================================
// STORAGE CONFIGURATION WITH DYNAMIC SUBFOLDER
// ============================================

const createStorage = (subfolder?: string) => {
  return multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
      let uploadPath = uploadDirs.images; // default

      try {
        // Determine upload path based on file type
        if (
          file.fieldname === "audioFile" ||
          file.mimetype.startsWith("audio/")
        ) {
          uploadPath = uploadDirs.medias;
        } else if (file.mimetype === "application/pdf") {
          uploadPath = uploadDirs.docs;
        } else if (file.mimetype.startsWith("image/")) {
          uploadPath = subfolder
            ? ensureSubfolderExists(subfolder)
            : uploadDirs.images;
        }

        cb(null, uploadPath);
      } catch (error) {
        errorLogger.error("Error determining upload destination:", error);
        cb(new Error("Failed to determine upload destination"), "");
      }
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
      try {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, "_");

        cb(null, `${sanitizedBaseName}-${uniqueSuffix}${ext}`);
      } catch (error) {
        errorLogger.error("Error generating filename:", error);
        cb(new Error("Failed to generate filename"), "");
      }
    },
  });
};

// ============================================
// FILE FILTER
// ============================================

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allAllowedTypes = [
    ...ALLOWED_MIME_TYPES.images,
    ...ALLOWED_MIME_TYPES.documents,
    ...ALLOWED_MIME_TYPES.audio,
  ];

  if (
    allAllowedTypes.includes(file.mimetype as (typeof allAllowedTypes)[number])
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type '${file.mimetype}' is not allowed. Allowed types: ${allAllowedTypes.join(", ")}`
      )
    );
  }
};

// ============================================
// IMAGE OPTIMIZATION
// ============================================

const optimizeImage = async (filePath: string): Promise<boolean> => {
  try {
    const ext = path.extname(filePath).toLowerCase();

    // Only optimize image files
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      return false;
    }

    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    // Only optimize if file is larger than threshold
    if (fileSizeInBytes > FILE_LIMITS.imageOptimizationThreshold) {
      const optimizedPath = filePath.replace(ext, `_optimized${ext}`);

      await sharp(filePath)
        .resize(1920, 1080, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85, progressive: true })
        .toFile(optimizedPath);

      const optimizedStats = fs.statSync(optimizedPath);
      const optimizedSizeInMB = optimizedStats.size / (1024 * 1024);

      logger.info(
        `Image optimized: ${path.basename(filePath)} (${fileSizeInMB.toFixed(2)}MB → ${optimizedSizeInMB.toFixed(2)}MB)`
      );

      // If optimized version is smaller, replace original
      if (optimizedStats.size < fileSizeInBytes) {
        fs.unlinkSync(filePath);
        fs.renameSync(optimizedPath, filePath);
        logger.info(`Replaced original with optimized version`);
      } else {
        // Optimized version is larger, delete it
        fs.unlinkSync(optimizedPath);
        logger.info(`Optimized version larger, keeping original`);
      }

      return true;
    }

    logger.info(
      `Image size (${fileSizeInMB.toFixed(2)}MB) below threshold, skipping optimization`
    );

    return false;
  } catch (error) {
    errorLogger.error(`Image optimization failed for ${filePath}:`, error);
    return false;
  }
};

// ============================================
// FILE PATH PROCESSOR WITH DYNAMIC SUBFOLDER
// ============================================

const processUploadedFiles = async (
  files: { [fieldname: string]: Express.Multer.File[] },
  body: any,
  subfolder?: string
): Promise<void> => {
  // Helper to generate correct path based on file location
  const getFilePath = (file: Express.Multer.File): string => {
    const filename = file.filename;
    const fileDir = path.dirname(file.path);
    const relativePath = path.relative(process.cwd(), fileDir);

    // Normalize path separators to forward slashes for URLs
    return `/${relativePath}/${filename}`.replace(/\\/g, "/");
  };

  const fileProcessors: Record<
    string,
    (file: Express.Multer.File) => void | Promise<void>
  > = {
    // Single image fields
    image: async (file) => {
      body.image = getFilePath(file);
      if (file.mimetype.startsWith("image/")) {
        await optimizeImage(file.path).catch((error) => {
          errorLogger.error("Background image optimization failed:", error);
        });
      }
    },
    profileImage: async (file) => {
      body.profileImage = getFilePath(file);
      if (file.mimetype.startsWith("image/")) {
        await optimizeImage(file.path).catch((error) => {
          errorLogger.error(
            "Background profile image optimization failed:",
            error
          );
        });
      }
    },
    bannerImage: async (file) => {
      body.bannerImage = getFilePath(file);
      if (file.mimetype.startsWith("image/")) {
        await optimizeImage(file.path).catch((error) => {
          errorLogger.error(
            "Background banner image optimization failed:",
            error
          );
        });
      }
    },
    avatar: async (file) => {
      body.avatar = getFilePath(file);
      if (file.mimetype.startsWith("image/")) {
        await optimizeImage(file.path).catch((error) => {
          errorLogger.error("Background avatar optimization failed:", error);
        });
      }
    },
    banner: async (file) => {
      body.banner = getFilePath(file);
      if (file.mimetype.startsWith("image/")) {
        await optimizeImage(file.path).catch((error) => {
          errorLogger.error("Background banner optimization failed:", error);
        });
      }
    },
    logo: async (file) => {
      body.logo = getFilePath(file);
      if (file.mimetype.startsWith("image/")) {
        await optimizeImage(file.path).catch((error) => {
          errorLogger.error("Background logo optimization failed:", error);
        });
      }
    },

    // Multiple images
    images: async (file) => {
      if (!body.images) body.images = [];
      body.images.push(getFilePath(file));
      if (file.mimetype.startsWith("image/")) {
        await optimizeImage(file.path).catch((error) => {
          errorLogger.error("Background images optimization failed:", error);
        });
      }
    },

    // Audio file
    audioFile: (file) => {
      body.audioFile = getFilePath(file);
    },

    // Document
    document: (file) => {
      body.document = getFilePath(file);
    },
  };

  // Process each uploaded file
  for (const [fieldName, fileArray] of Object.entries(files)) {
    if (fileProcessors[fieldName]) {
      for (const file of fileArray) {
        await fileProcessors[fieldName](file);
      }
    }
  }
};

// ============================================
// MAIN FILE UPLOAD HANDLER WITH OPTIONS
// ============================================

interface FileUploadOptions {
  subfolder?: string;
  maxImagesCount?: number;
}

const fileUploadHandler = (options?: FileUploadOptions) => {
  const { subfolder, maxImagesCount = 10 } = options || {};

  return (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({
      storage: createStorage(subfolder),
      fileFilter,
      limits: {
        fileSize: FILE_LIMITS.maxFileSize,
        files: FILE_LIMITS.maxFiles,
      },
    });

    const uploadFields = upload.fields([
      { name: "image", maxCount: 1 },
      { name: "images", maxCount: maxImagesCount },
      { name: "profileImage", maxCount: 1 },
      { name: "bannerImage", maxCount: 1 },
      { name: "audioFile", maxCount: 1 },
      { name: "document", maxCount: 1 },
      { name: "avatar", maxCount: 1 },
      { name: "banner", maxCount: 1 },
      { name: "logo", maxCount: 1 },
    ]);

    uploadFields(req, res, async (err: any) => {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        errorLogger.error("Multer error:", err);

        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: `File too large. Maximum size is ${FILE_LIMITS.maxFileSize / (1024 * 1024)}MB`,
          });
        }

        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: `Too many files. Maximum is ${FILE_LIMITS.maxFiles} files`,
          });
        }

        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: err.message || "File upload failed",
        });
      }

      // Handle other errors
      if (err) {
        errorLogger.error("File upload error:", err);
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: err.message || "File upload failed",
        });
      }

      try {
        // Process uploaded files
        if (req.files && typeof req.files === "object") {
          await processUploadedFiles(
            req.files as { [fieldname: string]: Express.Multer.File[] },
            req.body,
            subfolder
          );
        }

        logger.info(
          `File upload completed successfully${subfolder ? ` (subfolder: ${subfolder})` : ""}`
        );
        next();
      } catch (error) {
        errorLogger.error("File processing error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "File processing failed",
        });
      }
    });
  };
};

// ============================================
// CLEANUP UTILITY
// ============================================

export const deleteUploadedFile = (filePath: string): void => {
  try {
    if (!filePath) {
      logger.warn("Delete file called with empty path");
      return;
    }

    const fullPath = path.join(process.cwd(), filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      logger.info(`Deleted file: ${filePath}`);

      // Also delete optimized version if exists
      const ext = path.extname(fullPath);
      const optimizedPath = fullPath.replace(ext, `_optimized${ext}`);

      if (fs.existsSync(optimizedPath)) {
        fs.unlinkSync(optimizedPath);
        logger.info(`Deleted optimized file: ${optimizedPath}`);
      }
    } else {
      logger.warn(`File not found for deletion: ${filePath}`);
    }
  } catch (error) {
    errorLogger.error(`Failed to delete file ${filePath}:`, error);
  }
};

// ============================================
// BULK CLEANUP UTILITY
// ============================================

export const deleteUploadedFiles = (filePaths: string[]): void => {
  if (!Array.isArray(filePaths)) {
    logger.warn("deleteUploadedFiles called with non-array argument");
    return;
  }

  filePaths.forEach((filePath) => {
    if (filePath) {
      deleteUploadedFile(filePath);
    }
  });
};

// ============================================
// EXPORTS
// ============================================

export default fileUploadHandler;
export { FILE_LIMITS, ALLOWED_MIME_TYPES, uploadDirs };
