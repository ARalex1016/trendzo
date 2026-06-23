import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError, type ZodIssue } from "zod";

// Utils
import AppError from "../Utils/AppError.ts";

const parseIfJSON = (value: unknown) => {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const validateRequest =
  (schema: ZodObject<any>, source?: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      let data = source ? req.body[source] : req.body;

      // Parse JSON string if needed
      data = parseIfJSON(data);

      schema.parse(data);

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};

        err.issues.forEach((e: ZodIssue) => {
          const key = e.path.join(".") || "field";
          formattedErrors[key] = e.message;
        });

        const firstErrorMsg = Object.values(formattedErrors)[0];

        throw new AppError(firstErrorMsg || "Something went wrong", 400);
      }

      if (err instanceof AppError) {
        throw err;
      }

      throw new AppError((err as Error).message || "Validation error", 400);
    }
  };
