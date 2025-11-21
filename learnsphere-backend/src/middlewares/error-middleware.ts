import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error-handler.js";

// Express error middleware must have 4 parameters (err, req, res, next)
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    console.log(
      `[${err.timestamp}] - [Error]:- Method:${req.method} ReqURL:${req.url} - Msg: ${err.message}`
    );

    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Log unhandled errors
  console.log(`Unhandled Error: `, err);

  return res.status(500).json({
    success: false,
    status: "error",
    message: "Something went wrong. Please try again!",
  });
};
