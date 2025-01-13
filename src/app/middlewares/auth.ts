import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied, no token provided!' });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token!' });
  }
};

export default auth;
