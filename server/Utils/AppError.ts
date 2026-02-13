export default class AppError extends Error {
  public statusCode: number;
  public status: "error" | "fail";
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${String(statusCode).startsWith("4") ? "fail" : "error"}` as
      | "error"
      | "fail";
    this.isOperational = isOperational;

    // Capture proper stack trace (V8)
    Error.captureStackTrace(this, this.constructor);
  }
}
