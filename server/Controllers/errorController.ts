// src/controllers/errorController.ts
import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import AppError from "./../Utils/AppError.ts";
import { env } from "../Config/env.config.ts";

// Helper: handle CastError (invalid ObjectId)
const handleCastErrorDB = (err: mongoose.Error.CastError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Helper: handle duplicate key (E11000)
const handleDuplicateFieldsDB = (err: any) => {
  // err.keyValue usually has the offending field(s)
  const field = err.keyValue ? Object.keys(err.keyValue).join(", ") : "field";
  const value = err.keyValue ? JSON.stringify(err.keyValue) : "";
  const message = `Duplicate field value: ${field} ${value}. Please use another value.`;
  return new AppError(message, 400);
};

// Helper: handle validation errors
const handleValidationErrorDB = (err: mongoose.Error.ValidationError) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Validation error: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// (Optional) JWT error handlers if using JWTs
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpired = () =>
  new AppError("Your token has expired. Please log in again.", 401);

// Development error response
const sendErrorDev = (err: AppError | Error, res: Response) => {
  // err might be AppError or generic Error
  const isApp = err instanceof AppError;
  res.status(isApp ? err.statusCode : 500).json({
    status: isApp ? err.status : "error",
    message: err.message,
    stack: (err as any).stack,
    error: err,
  });
};

// Production error response: operational -> message; programming -> generic
const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or unknown error: don't leak details
    // log the error here (logger)
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong.",
    });
  }
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Ensure we always have statusCode and isOperational
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }

  // production
  let error = err;

  // Handle mongoose CastError (invalid id)
  if (err.name === "CastError") error = handleCastErrorDB(err);

  // Duplicate key error (MongoError with code 11000 or keyPattern)
  if (err.code && err.code === 11000) error = handleDuplicateFieldsDB(err);

  // mongoose ValidationError
  if (err.name === "ValidationError") error = handleValidationErrorDB(err);

  // JWT errors
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpired();

  return sendErrorProd(error, res);
};
