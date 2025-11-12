// Backend/src/shared/sendResponse.ts
import { Response } from "express";

type IData<T> = {
  success: boolean;
  statusCode: number;
  message?: string;
  paymentIntent?: string | undefined;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
    [key: string]: unknown;
  };
  summary?: unknown;
  data?: T;
};

const sendResponse = <T>(res: Response, data: IData<T>) => {
  const resData = {
    success: data.success,
    message: data.message,
    pagination: data.pagination,
    meta: data.meta,
    paymentIntent: data.paymentIntent,
    summary: data.summary,
    data: data.data,
  };
  res.status(data.statusCode).json(resData);
};

export default sendResponse;
