// src/jobs/autoFileCleanup.ts
import cron from "node-cron";
import fs from "fs";
import path from "path";
import { Model } from "mongoose";
import { User } from "../features/user/user.model";
import { logger, errorLogger } from "../shared/utils/logger";
import { FileManager } from "../shared/utils/fileManager";
import { Attorney } from "../features/attorneys/attorney.model";
import { PracticeArea } from "../features/practice_areas/practiceArea.model";

// Define all models and their file fields with proper typing
interface FileModelConfig {
  model: Model<any>;
  fields: string[];
  modelName: string;
}

const FILE_MODELS: FileModelConfig[] = [
  { model: User, fields: ["profileImage"], modelName: "User" },
  {
    model: Attorney,
    fields: ["profileImage", "bannerImage"],
    modelName: "Attorney",
  },
  { model: PracticeArea, fields: ["image"], modelName: "PracticeArea" },
  // Add more models here as needed
  // { model: Post, fields: ['image', 'attachments'], modelName: 'Post' },
];

// Upload directories to scan (including dynamic subfolders)
const UPLOAD_DIRS = ["uploads/images", "uploads/medias", "uploads/docs"];

// Recursively get all files in a directory and its subdirectories
function getAllFilesInDirectory(dirPath: string): string[] {
  const files: string[] = [];

  try {
    if (!fs.existsSync(dirPath)) {
      return files;
    }

    const items = fs.readdirSync(dirPath);

    items.forEach((item) => {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        // Recursively get files from subdirectories
        files.push(...getAllFilesInDirectory(fullPath));
      } else if (stats.isFile()) {
        // Convert absolute path to relative path from project root
        const relativePath = path.relative(process.cwd(), fullPath);
        files.push(`/${relativePath}`.replace(/\\/g, "/"));
      }
    });
  } catch (error) {
    errorLogger.error(`Error scanning directory ${dirPath}:`, error);
  }

  return files;
}

async function cleanupOrphanedFiles() {
  const startTime = Date.now();

  try {
    logger.info("🧹 Starting automatic unused file cleanup...");

    const referencedFiles = new Set<string>();
    let documentsScanned = 0;

    // Collect all referenced files from database
    for (const { model, fields, modelName } of FILE_MODELS) {
      try {
        const projection = fields.reduce(
          (acc, field) => ({ ...acc, [field]: 1 }),
          {}
        );

        const documents = await model.find({}, projection).lean();
        documentsScanned += documents.length;

        documents.forEach((doc: any) => {
          fields.forEach((field) => {
            const value = doc[field];
            if (value) {
              if (Array.isArray(value)) {
                value.forEach((file) => {
                  if (file && typeof file === "string") {
                    referencedFiles.add(file);
                  }
                });
              } else if (typeof value === "string") {
                referencedFiles.add(value);
              }
            }
          });
        });

        logger.info(`📄 Scanned ${documents.length} ${modelName} documents`);
      } catch (error) {
        errorLogger.error(`❌ Error scanning ${modelName} model:`, error);
      }
    }

    logger.info(
      `📊 Total files referenced in database: ${referencedFiles.size}`
    );

    // Find and delete orphaned files
    let deletedCount = 0;
    let failedCount = 0;
    let totalFilesScanned = 0;

    for (const dir of UPLOAD_DIRS) {
      try {
        const fullPath = path.join(process.cwd(), dir);

        if (!fs.existsSync(fullPath)) {
          logger.warn(`⚠️  Directory does not exist: ${dir}`);
          continue;
        }

        // Get all files including those in subdirectories
        const allFiles = getAllFilesInDirectory(fullPath);
        totalFilesScanned += allFiles.length;

        for (const filePath of allFiles) {
          if (!referencedFiles.has(filePath)) {
            try {
              FileManager.deleteFile(filePath);
              deletedCount++;
            } catch (error) {
              failedCount++;
              errorLogger.error(`Failed to delete ${filePath}:`, error);
            }
          }
        }
      } catch (error) {
        errorLogger.error(`❌ Error processing directory ${dir}:`, error);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    logger.info(`
╔═══════════════════════════════════════════════════════════╗
║           📊 File Cleanup Summary                         ║
╠═══════════════════════════════════════════════════════════╣
║  Documents Scanned:      ${documentsScanned.toString().padStart(6)} documents          ║
║  Files in Database:      ${referencedFiles.size.toString().padStart(6)} files              ║
║  Files Scanned:          ${totalFilesScanned.toString().padStart(6)} files              ║
║  Orphaned Files Deleted: ${deletedCount.toString().padStart(6)} files              ║
║  Failed Deletions:       ${failedCount.toString().padStart(6)} files              ║
║  Duration:               ${duration.padStart(6)} seconds          ║
╚═══════════════════════════════════════════════════════════╝
    `);
  } catch (error) {
    errorLogger.error("❌ Critical error in automatic file cleanup:", error);
  }
}

// Start automatic cleanup - runs daily at 3 AM
export const startAutoFileCleanup = () => {
  // Define the cleanup function wrapper
  const cleanupTask = () => {
    cleanupOrphanedFiles().catch((error) => {
      errorLogger.error("Error in scheduled file cleanup:", error);
    });
  };

  // Schedule the job to run daily at 3 AM
  cron.schedule("0 3 * * *", cleanupTask);

  logger.info("📅 Automatic unused file cleanup scheduled (daily at 3 AM)");

  // Optional: Run on startup (commented out by default)
  // Uncomment the line below if you want cleanup to run immediately on server start
  // cleanupTask();
};
