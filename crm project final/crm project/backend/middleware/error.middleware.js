import { ApiError } from "../utils/apiError.js";

// 404 - Route Not Found
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Global Error Handler
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // Show full error in development
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field} already exists`;
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && statusCode === 500
      ? { stack: err.stack }
      : {}),
  });
};