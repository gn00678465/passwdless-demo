import express, { Response, NextFunction } from "express";
import { generateRegistrationOptions, verifyRegistrationResponse } from "@simplewebauthn/server";
import type { GenerateRegistrationOptionsOpts } from "@simplewebauthn/server";
import type {
  RegistrationResponseJSON,
  AuthenticatorTransportFuture,
  PublicKeyCredentialDescriptorFuture
} from "@webauthn/types";

import { TypedRequestBody } from "../types";
import { CustomError } from "../middleware";
import { userService, credentialService } from "../service";
import { Base64Url } from "../utils";

const router = express.Router();

type PostRegistrationReqBody = TypedRequestBody<{
  username: string;
}>;

const handleRegisterStart = async (
  req: PostRegistrationReqBody,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.body;

  if (!username) {
    return next(new CustomError("請填入使用者名稱", 400));
  }

  try {
    let user = await userService.getUserByUsername(username);
    if (!user) {
      user = await userService.createUser(username);
    }

    const credentials = await credentialService.getAllCredentialByUserId(user.id);
    const excludeCredentials = credentials.map((credential) => {
      return {
        id: Base64Url.decodeBase64Url(credential.credential_id),
        type: "public-key",
        transports: JSON.parse(credential.transports) as AuthenticatorTransportFuture[]
      } as PublicKeyCredentialDescriptorFuture;
    });
    const opts: GenerateRegistrationOptionsOpts = {
      rpName: String(process.env.RP_NAME),
      rpID: String(process.env.RP_ID),
      userID: user.id,
      userName: username,
      timeout: 90000,
      attestationType: "none",
      excludeCredentials: excludeCredentials,
      authenticatorSelection: {
        residentKey: "discouraged",
        userVerification: "preferred"
      },
      supportedAlgorithmIDs: [-7, -257]
    };

    const options = await generateRegistrationOptions(opts);

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

type PutRegistrationReqBody = TypedRequestBody<{
  data: RegistrationResponseJSON;
}>;

const handleRegisterFinish = async (
  req: PutRegistrationReqBody,
  res: Response,
  next: NextFunction
) => {
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

    const verification = await verifyRegistrationResponse({
      response: data,
      expectedChallenge: currentChallenge,
      expectedOrigin: String(req.headers.origin),
      expectedRPID: process.env.RP_ID,
      requireUserVerification: true
    });

    if (verification.verified && verification.registrationInfo) {
      const { credentialPublicKey, credentialID, counter } = verification.registrationInfo;

      const credentialInfo = await credentialService.saveNewCredential(
        loggedInUserId,
        Base64Url.encodeBase64Url(credentialID),
        Base64Url.encodeBase64Url(credentialPublicKey),
        counter,
        JSON.stringify(data.response.transports)
      );
      const { username = undefined, id = undefined } =
        (await userService.getUserById(loggedInUserId)) || {};

      if (username && id) {
        res.status(200).json({
          status: "Success",
          data: {
            username,
            userId: id,
            ...credentialInfo
          }
        });
      } else {
        next(new CustomError("User is not exist!", 400));
      }
    } else {
      next(new CustomError("Verification failed", 400));
    }
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Internal Server Error", 500));
  } finally {
    req.session.currentChallenge = undefined;
    req.session.loggedInUserId = undefined;
  }
};

router.post("/registration", handleRegisterStart);

router.put("/registration", handleRegisterFinish);

export default router;
