// src/app/modules/user/user.interface.ts
import { Document, Model, Types } from 'mongoose';
import { STATUS, USER_ROLE } from "../../shared/enums/user";

export interface IDeviceToken {
  token: string;
  platform: 'ios' | 'android' | 'web';
  createdAt: Date;
}

export interface IAuthentication {
  isResetPassword: boolean;
  oneTimeCode?: number;
  expireAt?: Date;
}

export interface ISocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  profileImage?: string;
  role: USER_ROLE;
  status: STATUS;
  verified: boolean;
  isOnline: boolean;
  lastSeen: Date;
  deviceTokens?: IDeviceToken[];
  isSubscribed?: boolean;
  subscription?: Types.ObjectId;
  authentication?: IAuthentication;
  dateOfBirth?: Date;
  bio?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
  language?: string;
  socialLinks?: ISocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

export interface UserModel extends Model<IUser, {}, IUserMethods> {
  isExistUserById(id: string): Promise<IUser | null>;
  isExistUserByEmail(email: string): Promise<IUser | null>;
  isAccountCreated(id: string): Promise<IUser | null>;
  isMatchPassword(password: string, hashPassword: string): Promise<boolean>;
}

export interface IUserFilters {
  searchTerm?: string;
  role?: USER_ROLE;
  status?: STATUS;
  verified?: boolean;
  isSubscribed?: boolean;
  isDeleted?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface IUserUpdatePayload {
  fullName?: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  dateOfBirth?: Date;
  bio?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
  language?: string;
  socialLinks?: ISocialLinks;
  profileImage?: string;
}

export interface IAdminUserUpdatePayload extends IUserUpdatePayload {
  email?: string;
  role?: USER_ROLE;
  status?: STATUS;
  verified?: boolean;
  isSubscribed?: boolean;
}
