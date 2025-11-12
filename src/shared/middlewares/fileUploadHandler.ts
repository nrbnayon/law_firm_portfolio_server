// src/app/middlewares/fileUploadHandler.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';

// ============================================
// DIRECTORY SETUP
// ============================================

const uploadDirs = {
  images: path.join(process.cwd(), 'uploads', 'images'),
  docs: path.join(process.cwd(), 'uploads', 'docs'),
  medias: path.join(process.cwd(), 'uploads', 'medias'),
} as const;

// Ensure directories exist
Object.values(uploadDirs).forEach(dir => {
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
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  documents: ['application/pdf'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/m4a'],
} as const;

// ============================================
// STORAGE CONFIGURATION
// ============================================

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    let uploadPath = uploadDirs.images; // default

    // Determine upload path based on file type
    if (file.fieldname === 'audioFile' || file.mimetype.startsWith('audio/')) {
      uploadPath = uploadDirs.medias;
    } else if (file.mimetype === 'application/pdf') {
      uploadPath = uploadDirs.docs;
    } else if (file.mimetype.startsWith('image/')) {
      uploadPath = uploadDirs.images;
    }

    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');

    cb(null, `${sanitizedBaseName}-${uniqueSuffix}${ext}`);
  },
});

// ============================================
// FILE FILTER
// ============================================

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allAllowedTypes = [
    ...ALLOWED_MIME_TYPES.images,
    ...ALLOWED_MIME_TYPES.documents,
    ...ALLOWED_MIME_TYPES.audio,
  ];

  if (allAllowedTypes.includes(file.mimetype as typeof allAllowedTypes[number])) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type '${file.mimetype}' is not allowed. Allowed types: ${allAllowedTypes.join(', ')}`,
      ),
    );
  }
};

// ============================================
// MULTER CONFIGURATION
// ============================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_LIMITS.maxFileSize,
    files: FILE_LIMITS.maxFiles,
  },
});

// ============================================
// IMAGE OPTIMIZATION
// ============================================

const optimizeImage = async (filePath: string): Promise<boolean> => {
  try {
    const ext = path.extname(filePath).toLowerCase();

    // Only optimize image files
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      return false;
    }

    const stats = fs.statSync(filePath);
    const fileSizeInMB = stats.size / (1024 * 1024);

    // Only optimize if file is larger than threshold
    if (fileSizeInMB > FILE_LIMITS.imageOptimizationThreshold / (1024 * 1024)) {
      const optimizedPath = filePath.replace(ext, `_optimized${ext}`);

      await sharp(filePath)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85, progressive: true })
        .toFile(optimizedPath);

      logger.info(
        `Image optimized: ${path.basename(filePath)} (${fileSizeInMB.toFixed(2)}MB)`,
      );

      return true;
    }

    logger.info(
      `Image size (${fileSizeInMB.toFixed(2)}MB) below threshold, skipping optimization`,
    );

    return false;
  } catch (error) {
    logger.error(`Image optimization failed for ${filePath}:`, error);
    return false;
  }
};

// ============================================
// FILE PATH PROCESSOR
// ============================================

const processUploadedFiles = async (
  files: { [fieldname: string]: Express.Multer.File[] },
  body: any,
): Promise<void> => {
  const fileProcessors: Record<string, (file: Express.Multer.File) => void> = {
    // Single image fields
    image: file => {
      body.image = `/uploads/images/${file.filename}`;
      optimizeImage(file.path).catch(error => {
        logger.error('Background image optimization failed:', error);
      });
    },
    profileImage: file => {
      body.profileImage = `/uploads/images/${file.filename}`;
      optimizeImage(file.path).catch(error => {
        logger.error('Background profile image optimization failed:', error);
      });
    },
    avatar: file => {
      body.avatar = `/uploads/images/${file.filename}`;
      optimizeImage(file.path).catch(error => {
        logger.error('Background avatar optimization failed:', error);
      });
    },
    banner: file => {
      body.banner = `/uploads/images/${file.filename}`;
      optimizeImage(file.path).catch(error => {
        logger.error('Background banner optimization failed:', error);
      });
    },
    logo: file => {
      body.logo = `/uploads/images/${file.filename}`;
      optimizeImage(file.path).catch(error => {
        logger.error('Background logo optimization failed:', error);
      });
    },

    // Multiple images
    images: file => {
      if (!body.images) body.images = [];
      body.images.push(`/uploads/images/${file.filename}`);
      optimizeImage(file.path).catch(error => {
        logger.error('Background images optimization failed:', error);
      });
    },

    // Audio file
    audioFile: file => {
      body.audioFile = `/uploads/medias/${file.filename}`;
    },

    // Document
    document: file => {
      body.document = `/uploads/docs/${file.filename}`;
    },
  };

  // Process each uploaded file
  for (const [fieldName, fileArray] of Object.entries(files)) {
    if (fileProcessors[fieldName]) {
      fileArray.forEach(file => fileProcessors[fieldName](file));
    }
  }
};

// ============================================
// FORM DATA TRANSFORMER
// ============================================

const transformFormData = (body: any): void => {
  // Transform boolean fields
  const booleanFields = [
    'isFeatured',
    'offlineSupported',
    'verified',
    'isSubscribed',
  ];
  booleanFields.forEach(field => {
    if (body[field] !== undefined) {
      body[field] = body[field] === 'true' || body[field] === true;
    }
  });

  // Transform number fields
  const numberFields = [
    'latitude',
    'longitude',
    'price',
    'totalEvent',
    'fileSize',
    'duration',
  ];
  numberFields.forEach(field => {
    if (body[field] !== undefined && body[field] !== '') {
      const num = parseFloat(body[field]);
      body[field] = isNaN(num) ? undefined : num;
    }
  });

  // Transform JSON string fields
  const jsonFields = ['socialLinks', 'offlineData'];
  jsonFields.forEach(field => {
    if (body[field] && typeof body[field] === 'string') {
      try {
        body[field] = JSON.parse(body[field]);
      } catch {
        logger.warn(`Failed to parse ${field} as JSON, setting to undefined`);
        body[field] = undefined;
      }
    }
  });

  // Transform array fields (e.g., categories[])
  Object.keys(body).forEach(key => {
    if (key.endsWith('[]')) {
      const newKey = key.slice(0, -2);
      body[newKey] = Array.isArray(body[key]) ? body[key] : [body[key]];
      delete body[key];
    }
  });
};

// ============================================
// MAIN FILE UPLOAD HANDLER
// ============================================

const fileUploadHandler = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uploadFields = upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'images', maxCount: 10 },
      { name: 'profileImage', maxCount: 1 },
      { name: 'audioFile', maxCount: 1 },
      { name: 'document', maxCount: 1 },
      { name: 'avatar', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
    ]);

    uploadFields(req, res, async (err: any) => {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        logger.error('Multer error:', err);

        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: `File too large. Maximum size is ${FILE_LIMITS.maxFileSize / (1024 * 1024)}MB`,
          });
        }

        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: `Too many files. Maximum is ${FILE_LIMITS.maxFiles} files`,
          });
        }

        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: err.message || 'File upload failed',
        });
      }

      // Handle other errors
      if (err) {
        logger.error('File upload error:', err);
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: err.message || 'File upload failed',
        });
      }

      try {
        // Process uploaded files
        if (req.files && typeof req.files === 'object') {
          await processUploadedFiles(
            req.files as { [fieldname: string]: Express.Multer.File[] },
            req.body,
          );
        }

        // Transform form data
        if (req.body) {
          transformFormData(req.body);
        }

        logger.info('File upload completed successfully');
        next();
      } catch (error) {
        logger.error('File processing error:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'File processing failed',
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
    }
  } catch (error) {
    logger.error(`Failed to delete file ${filePath}:`, error);
  }
};

export default fileUploadHandler;
