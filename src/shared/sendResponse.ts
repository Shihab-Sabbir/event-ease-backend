import { Response } from 'express';

type IApiInterface<T> = {
  success: boolean;
  statusCode: number;
  result?: T | null;
  message?: string | null;
};

const sendResponse = <T>(res: Response, data: IApiInterface<T>): void => {
  const { success, message = null, result = null, statusCode } = data;
  res.status(statusCode).send({
    success: success,
    message: message,
    data: result,
  });
};

export default sendResponse;
