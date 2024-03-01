import express, { Request, Response, NextFunction } from "express";
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} from "@simplewebauthn/server";
import type { GenerateAuthenticationOptionsOpts } from "@simplewebauthn/server";

import {
  TypedRequestBody,
  AuthenticatorTransportFuture,
  PublicKeyCredentialDescriptorFuture
} from "../types";
import { CustomError } from "../middleware";
import { userService, credentialService } from "../service";
import { uint8ArrayToBase64, base64ToUint8Array, Base64Url } from "../utils";

const router = express.Router();

type PostAuthentificationReqBody = TypedRequestBody<{ username: string }>;

const handleAuthStart = async (
  req: PostAuthentificationReqBody,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.body;
  if (!username) {
    return next(new CustomError("請填入使用者名稱", 400));
  }

  try {
    const user = await userService.getUserByUsername(username);
    if (!user) {
      return next(new CustomError("User ID is exist", 400));
    }

    const credentials = await credentialService.getAllCredentialByUserId(user.id);

    const allowCredentials = credentials.map((credential) => {
      return {
        id: Base64Url.decodeBase64Url(credential.credential_id),
        type: "public-key",
        transports: JSON.parse(credential.transports) as AuthenticatorTransportFuture[]
      } as PublicKeyCredentialDescriptorFuture;
    });

    const opts: GenerateAuthenticationOptionsOpts = {
      userVerification: "preferred",
      allowCredentials: allowCredentials,
      rpID: process.env.RP_ID
    };

    const options = await generateAuthenticationOptions(opts);

    req.session.currentChallenge = options.challenge;
    req.session.loggedInUserId = user.id;

    res.status(200).json({
      status: "Success",
      data: options
    });
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Internal Server Error", 500));
  }
};

const handleAuthFinish = async (req: Request, res: Response, next: NextFunction) => {
  const { currentChallenge, loggedInUserId } = req.session;

  if (!loggedInUserId) {
    return next(new CustomError("User ID is missing", 400));
  }

  if (!currentChallenge) {
    return next(new CustomError("Current challenge is missing", 400));
  }
  try {
    const { data = undefined } = req.body;
    if (!data) {
      return next(new CustomError("缺少必要資訊", 403));
    }

    const authenticator = await credentialService.getCredentialByCredentialId(data.id);
    if (!authenticator) {
      return next(new CustomError("User is not registered this device", 403));
    }

    const verification = await verifyAuthenticationResponse({
      response: data as any,
      expectedChallenge: currentChallenge,
      expectedOrigin: String(req.headers.origin),
      expectedRPID: process.env.RP_ID,
      authenticator: {
        credentialID: base64ToUint8Array(authenticator.credential_id),
        credentialPublicKey: base64ToUint8Array(authenticator.public_key),
        counter: authenticator.counter,
        transports: JSON.parse(authenticator.transports)
      },
      requireUserVerification: true
    });

    if (verification.verified && verification.authenticationInfo) {
    } else {
      next(new CustomError("Verification failed", 400));
    }

    const user = await userService.getUserById(loggedInUserId);

    res.status(200).json({
      status: "Success",
      data: {
        useId: loggedInUserId,
        credentialId: Base64Url.encodeBase64Url(verification.authenticationInfo.credentialID),
        username: user?.username
      }
    });
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Internal Server Error", 500));
  } finally {
    req.session.currentChallenge = undefined;
    req.session.loggedInUserId = undefined;
  }
};

router.post("/authentication", handleAuthStart);
router.put("/authentication", handleAuthFinish);
export default router;
