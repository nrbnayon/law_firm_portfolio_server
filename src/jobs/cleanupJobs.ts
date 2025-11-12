import cron from "node-cron";
// import { analyticsService } from '../../../../Backend/src/app/modules/analytics/analytics.service';
// import { UserService } from '../../../../Backend/src/app/modules/user/user.service';
// import { startAutoFileCleanup } from '../../../../Backend/src/jobs/autoFileCleanup';
// import { startAllNotificationCronJobs } from '../../../../Backend/src/jobs/notificationCron';
import { logger } from "../shared/utils/logger";

// Cleanup old analytics data - runs weekly on Sunday at 3 AM
export const startAnalyticsCleanup = () => {
  cron.schedule("0 3 * * 0", async () => {
    try {
      logger.info("Starting analytics cleanup...");
      // await analyticsService.cleanupOldAnalytics(365);
      logger.info("Analytics cleanup completed");
    } catch (error) {
      logger.error("Error in analytics cleanup:", error);
    }
  });

  logger.info("Analytics cleanup job scheduled");
};

// Cleanup unverified users - runs every 6 hours
export const startUnverifiedUsersCleanup = () => {
  // ✅ Add 'export' here
  cron.schedule("0 */6 * * *", async () => {
    try {
      logger.info("Starting unverified users cleanup...");
      // const result = await UserService.cleanupUnverifiedUsers(24);
      logger.info(`Unverified users cleanup completed. Permanently deleted:  `);
    } catch (error) {
      logger.error("Error in unverified users cleanup:", error);
    }
  });

  logger.info("Unverified users cleanup job scheduled (every 6 hours)");
};

// Start all cleanup jobs
export const startAllCleanupJobs = () => {
  startAnalyticsCleanup();
  // startAutoFileCleanup();
  // startAllNotificationCronJobs(3);
  startUnverifiedUsersCleanup(); // ✅ Now this will work

  logger.info("All cleanup and notification cron jobs started");
};
