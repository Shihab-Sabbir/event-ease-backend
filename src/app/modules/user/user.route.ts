import express from 'express';
import { UserController } from './user.controller';
import { userZodSchema } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
const userRoutes = express.Router();

userRoutes.post(
  '/create-user',
  validateRequest(userZodSchema),
  UserController.createUser
);

userRoutes.post(
  '/login',
  validateRequest(userZodSchema),
  UserController.loginUser
);

export default userRoutes;
