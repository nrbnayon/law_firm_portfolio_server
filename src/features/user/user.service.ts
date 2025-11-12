//   Create a new user account

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
import { logger } from "../../shared/utils/logger";
import QueryBuilder from "../../shared/utils/QueryBuilder";

const createUserIntoDB = async (payload: Partial<IUser>): Promise<IUser> => {
  // Set default role
  payload.role = USER_ROLE.USER;
  payload.language = payload.language || "en";

  // Check if email already exists
  const emailExists = await User.isExistUserByEmail(payload.email!);
  if (emailExists) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "An account with this email already exists"
    );
  }

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

export const UserService = {
  createUserIntoDB,
  getUserProfileFromDB,
  getAllUsersFromDB,
};
