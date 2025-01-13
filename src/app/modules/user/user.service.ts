import bcrypt from 'bcryptjs';
import { IUser } from './user.interface';
import User from './user.model';

const createUserDB = async (userInfo: IUser): Promise<IUser | null> => {
  const { email, password } = userInfo;

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await User.create({
    email,
    password: hashedPassword,
  });

  if (!createdUser) {
    throw new Error('Failed to create user!');
  }

  return createdUser;
};

const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      throw new Error('Incorrect password!');
    }

    return isMatch;
  } catch (error) {
    throw new Error('Error verifying password!');
  }
};

export const UserService = {
  createUserDB,
  verifyPassword,
};
