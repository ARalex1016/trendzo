import { ZodObject, ZodError, type ZodIssue } from "zod";
import type { Request, Response, NextFunction } from "express";

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

        return res.status(400).json({
          success: false,
          message: firstErrorMsg,
        });
      }

      // fallback for other errors
      return res.status(400).json({
        success: false,
        message: (err as Error).message || "Validation error",
      });
    }
  };
