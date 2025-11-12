// src\features\user\user.validation.ts
import { z } from "zod";
import { STATUS, USER_ROLE } from "../../shared/enums/user";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const createUserSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    email: z.string().trim().email("Invalid email address"),
    password: passwordSchema,
  }),
});


// Get all users query schema
const getAllUsersQuerySchema = z.object({
  query: z.object({
    searchTerm: z.string().trim().optional(),
    role: z.nativeEnum(USER_ROLE).optional(),
    status: z.nativeEnum(STATUS).optional(),
    verified: z
      .enum(['true', 'false'])
      .transform(val => val === 'true')
      .optional(),
    isSubscribed: z
      .enum(['true', 'false'])
      .transform(val => val === 'true')
      .optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).default(1),
    limit: z.string().regex(/^\d+$/).transform(Number).default(10),
    sortBy: z.string().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});


export const UserValidation = {
  createUserSchema,
  getAllUsersQuerySchema,
};

