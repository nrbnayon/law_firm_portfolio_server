// src/app/modules/user/user.model.ts
import { model, Schema } from "mongoose";
import { IUser, UserModel, IUserMethods } from "./user.interface";
import { USER_ROLE, STATUS } from "../../shared/enums/user";

const authenticationSchema = new Schema(
  {
    isResetPassword: {
      type: Boolean,
      default: false,
    },
    oneTimeCode: {
      type: Number,
      default: null,
    },
    expireAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    profileImage: {
      type: String,
      trim: true,
      default: null,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(USER_ROLE),
        message: "{VALUE} is not a valid role",
      },
      default: USER_ROLE.USER,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(STATUS),
        message: "{VALUE} is not a valid status",
      },
      default: STATUS.ACTIVE,
      index: true,
    },

    verified: {
      type: Boolean,
      default: false,
      index: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },

    isSubscribed: {
      type: Boolean,
      default: false,
    },

    authentication: {
      type: authenticationSchema,
      select: false,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

export const User = model<IUser, UserModel>("User", userSchema);
