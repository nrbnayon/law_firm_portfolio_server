import { ZodError, ZodIssue } from 'zod';
import { TErrorSource, TGenericErrorResponse } from '../types/error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSource = err.issues.map((issue: ZodIssue) => {
    return {
      path: String(issue?.path[issue?.path.length - 1]),
      message: issue.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'validation error',
    errorSources,
  };
};

export default handleZodError;
