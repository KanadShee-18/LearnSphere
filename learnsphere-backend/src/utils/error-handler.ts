import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("An unusual error occurred:", err.stack);

  res.status(400).json({
    message: err.message,
    code: 400,
  });
};
