// src/jobs/cleanupJobs.ts
import cron from "node-cron";
import { logger, errorLogger } from "../shared/utils/logger";
import { UserService } from "../features/user/user.service";
import { startAutoFileCleanup } from "./autoFileCleanup";

// Cleanup unverified users - runs every 6 hours
export const startUnverifiedUsersCleanup = () => {
  // Define the cleanup function
  const cleanupTask = async () => {
    try {
      logger.info("🧹 Starting unverified users cleanup...");
      const result = await UserService.cleanupUnverifiedUsers(24);

      if (result.deletedCount > 0) {
        logger.info(
          `✅ Unverified users cleanup completed. Permanently deleted: ${result.deletedCount} users`
        );
      } else {
        logger.info(
          "✅ Unverified users cleanup completed. No users to delete."
        );
      }
    } catch (error) {
      errorLogger.error("❌ Error in unverified users cleanup:", error);
    }
  };

  // Schedule the job to run every 6 hours
  cron.schedule("0 */6 * * *", cleanupTask);

  logger.info("📅 Unverified users cleanup job scheduled (every 6 hours)");

  // Run immediately on startup (optional, but recommended)
  cleanupTask().catch((error) => {
    errorLogger.error("Error in initial unverified users cleanup:", error);
  });
};

// Start all cleanup jobs
export const startAllCleanupJobs = () => {
  try {
    startAutoFileCleanup();
    startUnverifiedUsersCleanup();
    logger.info("✅ All cleanup jobs started successfully");
  } catch (error) {
    errorLogger.error("❌ Failed to start cleanup jobs:", error);
  }
};
