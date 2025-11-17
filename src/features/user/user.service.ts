import { StatusCodes } from "http-status-codes";
import { USER_ROLE } from "../../shared/enums/user";
import AppError from "../../shared/errors/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import {
  OTP_EXPIRY_MINUTES,
  userSearchableFields,
  userSensitiveFields,
} from "./user.constants";
import generateOTP from "../../shared/utils/generateOTP";
import { emailTemplate } from "../../shared/email/emailTemplate";
import { emailHelper } from "../../shared/email/emailHelper";
import { errorLogger, logger } from "../../shared/utils/logger";
import QueryBuilder from "../../shared/utils/QueryBuilder";
import { FileManager } from "../../shared/utils/fileManager";

const createUserIntoDB = async (payload: Partial<IUser>): Promise<IUser> => {
  // Check if email already exists
  const emailExists = await User.isExistUserByEmail(payload.email!);
  if (emailExists) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "An account with this email already exists"
    );
  }

  // Set default role
  payload.role = USER_ROLE.USER;

  // Create user
  const user = await User.create(payload);

  if (!user) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create user account"
    );
  }

  // Generate OTP for email verification
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

  // Update user with OTP
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        authentication: {
          oneTimeCode: otp,
          expireAt: otpExpiry,
          isResetPassword: false,
        },
      },
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to generate verification code"
    );
  }

  // Send verification email
  try {
    const emailValues = {
      name: user.fullName,
      otp,
      email: user.email,
    };

    const accountEmailTemplate = emailTemplate.createAccount(emailValues);
    await emailHelper.sendEmail(accountEmailTemplate);

    logger.info(`Verification email sent to: ${user.email}`);
  } catch (error) {
    logger.error("Failed to send verification email:", error);
    // Don't throw error, user is created successfully
  }

  return updatedUser;
};

/**
 * Get all users with filtering, sorting, and pagination
 */
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(
    User.find().select(userSensitiveFields.join(" ")),
    query
  )
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery.lean({ virtuals: true });
  const meta = await userQuery.countTotal();

  return {
    meta,
    result,
  };
};

/**
/**
 * Get current user profile
 */
const getUserProfileFromDB = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId)
    .select(userSensitiveFields.join(" "))
    .lean<IUser>({ virtuals: true });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};


const cleanupUnverifiedUsers = async (
  hoursOld: number = 24
): Promise<{ deletedCount: number; filesDeleted: number }> => {
  try {
    const cutoffTime = new Date(Date.now() - hoursOld * 60 * 60 * 1000);

    // First, find unverified users to get their file references
    const unverifiedUsers = await User.find({
      verified: false,
      createdAt: { $lt: cutoffTime },
    }).select("profileImage email fullName");

    if (unverifiedUsers.length === 0) {
      logger.info("No unverified users to cleanup");
      return { deletedCount: 0, filesDeleted: 0 };
    }

    // Collect file paths for deletion
    const filesToDelete: string[] = [];
    unverifiedUsers.forEach((user) => {
      if (user.profileImage) {
        filesToDelete.push(user.profileImage);
      }
    });

    // Delete associated files
    let filesDeleted = 0;
    if (filesToDelete.length > 0) {
      await FileManager.deleteFiles(filesToDelete);
      filesDeleted = filesToDelete.length;
      logger.info(`🗑️  Deleted ${filesDeleted} files from unverified users`);
    }

    // Delete users from database
    const result = await User.deleteMany({
      verified: false,
      createdAt: { $lt: cutoffTime },
    });

    if (result.deletedCount > 0) {
      logger.info(
        `✅ Permanently deleted ${result.deletedCount} unverified users older than ${hoursOld} hours`
      );

      // Log some details about deleted users (without sensitive info)
      const deletedEmails = unverifiedUsers
        .slice(0, 5)
        .map((u) => u.email)
        .join(", ");

      if (unverifiedUsers.length > 5) {
        logger.info(
          `Deleted users include: ${deletedEmails} and ${unverifiedUsers.length - 5} more...`
        );
      } else {
        logger.info(`Deleted users: ${deletedEmails}`);
      }
    }

    return {
      deletedCount: result.deletedCount,
      filesDeleted,
    };
  } catch (error) {
    errorLogger.error("❌ Error cleaning up unverified users:", error);
    throw error;
  }
};

export const UserService = {
  createUserIntoDB,
  getUserProfileFromDB,
  getAllUsersFromDB,
  cleanupUnverifiedUsers,
};