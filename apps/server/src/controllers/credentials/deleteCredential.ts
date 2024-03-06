import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../../middleware";
import { credentialService } from "../../service";
import { omit } from "../../utils";

export async function handleDeleteCredential(req: Request, res: Response, next: NextFunction) {
  const { loggedInUserId } = req.session;

  if (!loggedInUserId) {
    return next(new CustomError("User ID is missing", 400));
  }

  const { id = undefined } = req.params;

  if (!id) {
    return next(new CustomError("請帶入要移除的 Credential ID", 400));
  }

  try {
    const credentials = await credentialService.deleteCredentialByCredentialId(id, loggedInUserId);
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
