import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../middleware";

export const handleLogout = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { loggedInUserId } = req.session;
    console.log("🚀 ~ handleLogout ~ loggedInUserId:", loggedInUserId);

    if (!loggedInUserId) {
      return next(new CustomError("User ID is missing", 400));
    }

    res.status(200).json({
      status: "Success"
    });
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Internal Server Error", 500));
  } finally {
    req.session.loggedInUserId = undefined;
  }
};
