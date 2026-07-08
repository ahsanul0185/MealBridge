import { ZodError, ZodIssue } from "zod";
import { IErrorSources } from "../interfaces/error.interface.js";

const handleZodError = (err: ZodError) => {
  const errorSources: IErrorSources[] = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};

export default handleZodError;
