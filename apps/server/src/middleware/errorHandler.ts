import { Request, Response } from "express";
import { CustomError } from "./customError";

export function handleError(err: CustomError, req: Request, res: Response) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ status: "Error", message: message });
}
