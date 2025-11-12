// src/app/modules/user/user.constants.ts

export const userSearchableFields = [
  'fullName',
  'email',
  'phoneNumber',
  'bio',
  'address',
];

export const userFilterableFields = [
  'searchTerm',
  'role',
  'status',
  'verified',
  'isSubscribed',
  'isDeleted',
  'startDate',
  'endDate',
  'page',
  'limit',
  'sortBy',
  'sortOrder',
];

export const userSensitiveFields = [
  '-password',
  '-authentication',
  '-deviceTokens',
];

export const userPublicFields = [
  'fullName',
  'email',
  'profileImage',
  'role',
  'status',
  'verified',
  'bio',
  'createdAt',
];

export const MAX_DEVICE_TOKENS = 5;
export const OTP_EXPIRY_MINUTES = 20;
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
