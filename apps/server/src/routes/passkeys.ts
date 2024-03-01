import express, { Request, Response, NextFunction } from "express";
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} from "@simplewebauthn/server";
import type { GenerateAuthenticationOptionsOpts } from "@simplewebauthn/server";
import type { AuthenticationResponseJSON } from "@webauthn/types";

import { TypedRequestBody } from "../types";
import { CustomError } from "../middleware";
import { userService, credentialService } from "../service";
import { uint8ArrayToBase64, base64ToUint8Array, Base64Url } from "../utils";

const router = express.Router();

const handlePasskeysStart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opts: GenerateAuthenticationOptionsOpts = {
      userVerification: "preferred",
      allowCredentials: [],
      rpID: process.env.RP_ID
    };

    const options = await generateAuthenticationOptions(opts);

    req.session.currentChallenge = options.challenge;

    res.status(200).json({
      status: "Success",
      data: options
    });
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Internal Server Error", 500));
  }
};

type PutPasskeyReqBody = TypedRequestBody<{
  data: AuthenticationResponseJSON;
}>;

const handlePasskeysFinish = async (req: PutPasskeyReqBody, res: Response, next: NextFunction) => {
  const { currentChallenge } = req.session;

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
      response: data,
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

    res.status(200).json({
      status: "Success",
      data: {}
    });
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Internal Server Error", 500));
  } finally {
    req.session.currentChallenge = undefined;
  }
};

router.post("/passkeys", handlePasskeysStart);

router.put("/passkeys", handlePasskeysFinish);

export default router;
