// backend_server\src\features\auth\auth.service.ts
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { JwtPayload, Secret } from "jsonwebtoken";

import { User } from "../user/user.model";

import config from "../../config";
import { emailHelper } from "../../shared/email/emailHelper";
import { jwtHelper } from "../../shared/utils/jwtHelper";
import { emailTemplate } from "../../shared/email/emailTemplate";
import generateOTP from "../../shared/utils/generateOTP";
import { ResetToken } from "../resetToken/resetToken.model";
import AppError from "../../shared/errors/AppError";
import {
  IAuthResetPassword,
  IChangePassword,
  ILoginData,
  IVerifyEmail,
} from "../../shared/types/auth";

//login
const loginUserFromDB = async (payload: ILoginData) => {
  const { email, password } = payload;
  const isExistUser = await User.findOne({ email }).select("+password");
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //check verified and status
  if (!isExistUser.verified) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Please verify your account, then try to login again"
    );
  }

  //check match password
  if (
    password &&
    !(await User.isMatchPassword(password, isExistUser.password))
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password is incorrect!");
  }

  // Update user online status and last seen
  await User.findByIdAndUpdate(isExistUser._id, {
    isOnline: true,
    lastSeen: new Date(),
  });

  const tokenPayload = {
    id: isExistUser._id,
    role: isExistUser.role,
    email: isExistUser.email,
  };

  //create access token
  const accessToken = jwtHelper.createToken(
    tokenPayload,
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as string
  );

  //create refresh token
  const refreshToken = jwtHelper.createToken(
    tokenPayload,
    config.jwt.jwtRefreshSecret as Secret,
    config.jwt.jwtRefreshExpiresIn as string
  );

  // Get updated user data without password
  const updatedUser = await User.findById(isExistUser._id).select(
    "-password -authentication"
  );

  return {
    user: updatedUser,
    role: updatedUser?.role,
    accessToken,
    refreshToken,
  };
};

//forget password
const forgetPasswordToDB = async (email: string) => {
  const isExistUser = await User.isExistUserByEmail(email);
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //send mail
  const otp = generateOTP();
  const value = {
    otp,
    email: isExistUser.email,
  };
  const forgetPassword = emailTemplate.resetPassword(value);
  emailHelper.sendEmail(forgetPassword);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 20 * 60000),
  };
  await User.findOneAndUpdate({ email }, { $set: { authentication } });
};

const verifyEmailToDB = async (payload: IVerifyEmail) => {
  const { email, oneTimeCode } = payload;

  console.log("Get email and otp::", email, oneTimeCode);

  const isExistUser = await User.findOne({ email }).select("+authentication");
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (!oneTimeCode) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Please give the otp, check your email we send a code"
    );
  }

  // Check if authentication exists and has the required properties
  if (!isExistUser.authentication) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Authentication data not found"
    );
  }

  console.log(
    "Stored OTP:",
    isExistUser.authentication.oneTimeCode,
    "Provided OTP:",
    oneTimeCode
  );

  // FIX: Convert both to numbers for comparison
  const storedOTP = Number(isExistUser.authentication.oneTimeCode);
  const providedOTP = Number(oneTimeCode);

  if (storedOTP !== providedOTP) {
    throw new AppError(StatusCodes.BAD_REQUEST, "You provided wrong otp");
  }

  // Check if expireAt exists before comparison
  if (!isExistUser.authentication.expireAt) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP expiration time not set");
  }

  const date = new Date();
  if (date > isExistUser.authentication.expireAt) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Otp already expired, Please try again"
    );
  }

  const tokenPayload = {
    id: isExistUser._id,
    role: isExistUser.role,
    email: isExistUser.email,
  };

  //create access token
  const accessToken = jwtHelper.createToken(
    tokenPayload,
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as string
  );

  //create refresh token
  const refreshToken = jwtHelper.createToken(
    tokenPayload,
    config.jwt.jwtRefreshSecret as Secret,
    config.jwt.jwtRefreshExpiresIn as string
  );

  let message;

  if (!isExistUser.verified) {
    await User.findOneAndUpdate(
      { _id: isExistUser._id },
      { verified: true, authentication: { oneTimeCode: null, expireAt: null } }
    );

    message = "Your email has been successfully verified.";
  } else {
    await User.findOneAndUpdate(
      { _id: isExistUser._id },
      {
        authentication: {
          isResetPassword: true,
          oneTimeCode: null,
          expireAt: null,
        },
      }
    );

    await ResetToken.create({
      user: isExistUser._id,
      token: accessToken,
      expireAt: new Date(Date.now() + 20 * 60000),
    });
    message = "Verification Successful";
  }

  // Get updated user data without password
  const updatedUser = await User.findById(isExistUser._id).select(
    "-password -authentication"
  );

  return {
    user: updatedUser,
    role: updatedUser?.role,
    accessToken,
    refreshToken,
    message,
  };
};

const resetPasswordToDB = async (
  token: string,
  payload: IAuthResetPassword
) => {
  const { email, newPassword, confirmPassword } = payload;

  //isExist token
  const isExistToken = await ResetToken.isExistToken(token);

  if (!email) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email is required");
  }

  if (!isExistToken) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
  }

  //user permission check
  const isExistUser = await User.findById(isExistToken.user).select(
    "+authentication"
  );
  if (!isExistUser?.authentication?.isResetPassword) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "You don't have permission to change the password. Please click again to 'Forgot Password'"
    );
  }

  //validity check
  const isValid = await ResetToken.isExpireToken(token);
  if (!isValid) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Token expired, Please click again to the forget password"
    );
  }

  //check password
  if (newPassword !== confirmPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "New password and Confirm password doesn't match!"
    );
  }

  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = {
    password: hashPassword,
    authentication: {
      isResetPassword: false,
    },
  };

  await User.findOneAndUpdate({ _id: isExistToken.user }, updateData, {
    new: true,
  });
};

const changePasswordToDB = async (
  user: JwtPayload,
  payload: IChangePassword
) => {
  const { currentPassword, newPassword, confirmPassword } = payload;

  const isExistUser = await User.findById(user.id).select("+password");
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //current password match
  if (
    currentPassword &&
    !(await User.isMatchPassword(currentPassword, isExistUser.password))
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Current password is incorrect"
    );
  }

  //newPassword and current password
  if (currentPassword === newPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Please give different password from current password"
    );
  }
  //new password and confirm password check
  if (newPassword !== confirmPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Password and Confirm password doesn't matched"
    );
  }

  //hash password
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = {
    password: hashPassword,
  };
  await User.findOneAndUpdate({ _id: user.id }, updateData, { new: true });
};

const deleteAccountToDB = async (user: JwtPayload) => {
  const result = await User.findByIdAndDelete(user?.id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "No User found");
  }

  return result;
};

const newAccessTokenToUser = async (token: string) => {
  // Check if the token is provided
  if (!token) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Token is required!");
  }

  const verifyUser = jwtHelper.verifyToken(
    token,
    config.jwt.jwtRefreshSecret as Secret
  );

  const isExistUser = await User.findById(verifyUser?.id);
  if (!isExistUser) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
  }

  //create token
  const accessToken = jwtHelper.createToken(
    {
      id: isExistUser._id,
      role: isExistUser.role,
      email: isExistUser.email,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as string
  );

  return { accessToken, role: isExistUser.role };
};

const resendVerificationEmailToDB = async (email: string) => {
  // Find the user by email
  const existingUser: any = await User.findOne({
    email: email,
  }).lean();

  if (!existingUser) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "User with this email does not exist!"
    );
  }

  if (existingUser?.verified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is already verified!");
  }

  // Generate OTP and prepare email
  const otp = generateOTP();
  const emailValues = {
    name: existingUser.fullName,
    otp,
    email: existingUser.email,
  };
  const accountEmailTemplate = emailTemplate.createAccount(emailValues);
  emailHelper.sendEmail(accountEmailTemplate);

  // Update user with authentication details
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 20 * 60000),
  };

  await User.findOneAndUpdate(
    { email: email },
    { $set: { authentication } },
    { new: true }
  );
};

//logout
const logoutUserFromDB = async (userId: string) => {
  const isExistUser = await User.findById(userId);
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  // Update user online status and last seen
  await User.findByIdAndUpdate(userId, {
    isOnline: false,
    lastSeen: new Date(),
  });
};

export const AuthService = {
  verifyEmailToDB,
  loginUserFromDB,
  forgetPasswordToDB,
  resetPasswordToDB,
  changePasswordToDB,
  deleteAccountToDB,
  newAccessTokenToUser,
  resendVerificationEmailToDB,
  logoutUserFromDB,
};
