import { RequestHandler } from 'express';
import { UserService } from './user.service';
import User from './user.model';

import jwt from 'jsonwebtoken';

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req.body;
    const result = await UserService.createUserDB(user);
    res.status(200).send({
      success: true,
      message: 'User created successfully!',
      data: result,
    });
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res
        .status(400)
        .json({ message: 'Email already taken! Please login.' });
    }
    next(error);
  }
};

const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body.user;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found!' });
    }

    const isPasswordValid = await UserService.verifyPassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '24h',
      }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createUser,
  loginUser,
};
