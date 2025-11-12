import { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync";
import sendResponse from "../../shared/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user.service";

const createUser = catchAsync(async (req, res) => {
  const value = {
    ...req.body,
  };

  await UserService.createUserIntoDB(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Please check your email to verify your account.",
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Profile data retrieved successfully",
    data: result,
  });
});

/**
 * Get all users (Admin only)
 */
const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

export const UserController = {
  createUser,
  getMyProfile,
  getAllUser,
};
