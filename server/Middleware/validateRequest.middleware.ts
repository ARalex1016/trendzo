import { ZodObject, ZodError, type ZodIssue } from "zod";
import type { Request, Response, NextFunction } from "express";

// Utils
import AppError from "../Utils/AppError.ts";

export const validateRequest =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        // Build a map of field -> message
        const formattedErrors: Record<string, string> = {};
        err.issues.forEach((e: ZodIssue) => {
          // e.path is an array like ["body","name"]
          const key = e.path.join(".") || "field";
          formattedErrors[key] = e.message;
        });

        const firstErrorMsg = Object.values(formattedErrors)[0];

        throw new AppError(firstErrorMsg || "Something went wrong", 400);
      }

      // fallback for other errors
      throw new AppError((err as Error).message || "Validation error", 400);
    }
  };
