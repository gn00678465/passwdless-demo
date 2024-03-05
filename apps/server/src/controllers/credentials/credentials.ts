import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../../middleware";
import { credentialService } from "../../service";
import { omit } from "../../utils";

export async function handleCredential(req: Request, res: Response, next: NextFunction) {
  const { loggedInUserId } = req.session;

  if (!loggedInUserId) {
    return next(new CustomError("User ID is missing", 400));
  }

  try {
    const credentials = await credentialService.getAllCredentialByUserId(loggedInUserId);
    if (credentials) {
      res.status(200).json({
        status: "Success",
        data: credentials.map((credential) => omit(credential, ["public_key"]))
      });
    }
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Internal Server Error", 500));
  }
}
