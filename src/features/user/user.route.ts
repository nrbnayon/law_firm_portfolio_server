
import { Router } from "express";
import validateRequest from "../../shared/middlewares/validateRequest";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import { USER_ROLE } from "../../shared/enums/user";
import auth from "../../shared/middlewares/auth";

const router = Router();

// PUBLIC ROUTES
router.post(
  "/sign-up",
  validateRequest(UserValidation.createUserSchema),
  UserController.createUser
);

router.get(
  "/me",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  UserController.getMyProfile
);

router.get(
  "/",
  auth(USER_ROLE.ADMIN),
  validateRequest(UserValidation.getAllUsersQuerySchema),
  UserController.getAllUser
);