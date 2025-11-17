// backend_server\src\features\auth\auth.controller.ts
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "./auth.service";
import catchAsync from "../../shared/utils/catchAsync";
import sendResponse from "../../shared/utils/sendResponse";
import config from "../../config";
import AppError from "../../shared/errors/AppError";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUserFromDB(loginData);

  // Set cookies for accessToken and refreshToken
  res.cookie("accessToken", result.accessToken, {
    secure: config.node_env === "production",
    // httpOnly: true,
    // sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("refreshToken", result.refreshToken, {
    secure: config.node_env === "production",
    // httpOnly: true,
    // sameSite: "strict",
    maxAge: 365 * 24 * 60 * 60 * 1000, // 365 days
  });

  res.cookie("userRole", result.role, {
    secure: config.node_env === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User login successfully",
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const verifyData = req.body;
  // console.log("Get email and otp::", verifyData);

  const result = await AuthService.verifyEmailToDB(verifyData);

  // Set cookies for accessToken and refreshToken
  res.cookie("accessToken", result.accessToken, {
    secure: config.node_env === "production",
    // httpOnly: true,
    // sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("refreshToken", result.refreshToken, {
    secure: config.node_env === "production",
    // httpOnly: true,
    // sameSite: "strict",
    maxAge: 365 * 24 * 60 * 60 * 1000, // 365 days
  });

  res.cookie("userRole", result.role, {
    secure: config.node_env === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message,
    data: result,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const email = req.body.email;
  const result = await AuthService.forgetPasswordToDB(email);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Please check your email, we send a OTP!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Authorization header is missing or invalid"
    );
  }

  const token = authorizationHeader.split(" ")[1];
  const { ...resetData } = req.body;
  const result = await AuthService.resetPasswordToDB(token, resetData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Password reset successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const { ...passwordData } = req.body;
  await AuthService.changePasswordToDB(user, passwordData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Password changed successfully",
  });
});

const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await AuthService.deleteAccountToDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Account Deleted successfully",
    data: result,
  });
});

const newAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;
  const result = await AuthService.newAccessTokenToUser(token);

  // Set new accessToken in cookie
  res.cookie("accessToken", result.accessToken, {
    secure: config.node_env === "production",
    // httpOnly: true,
    // sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("userRole", result.role, {
    secure: config.node_env === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Generate Access Token successfully",
    data: result,
  });
});

const resendVerificationEmail = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await AuthService.resendVerificationEmailToDB(email);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Generate OTP and send successfully",
      data: result,
    });
  }
);

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  await AuthService.logoutUserFromDB(user.id);

  // Clear all authentication cookies
  res.clearCookie("accessToken", {
    secure: config.node_env === "production",
    httpOnly: true,
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    secure: config.node_env === "production",
    httpOnly: true,
    sameSite: "strict",
  });

  res.clearCookie("userRole", {
    secure: config.node_env === "production",
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User logout successfully",
  });
});

export const AuthController = {
  verifyEmail,
  loginUser,
  forgetPassword,
  resetPassword,
  changePassword,
  deleteAccount,
  newAccessToken,
  resendVerificationEmail,
  logoutUser,
};
