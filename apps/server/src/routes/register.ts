import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { VerifiedRegistrationResponse } from "@simplewebauthn/server";

import { AuthenticatorDevice } from "./types";
import {
  getUserRegisteredAuthenticators,
  saveUserRegisterChallenge,
  getUserRegisterChallenge,
  clearUserRegisterChallenge,
  registerUserAuthenticator
} from "../controllers/database/database";
import { verifyRegistrationResponseAdapter } from "../controllers/adapter/register";
import { Base64Url } from "../utils";
// import {
//   verifyRegistrationResponse,
//   VerifyRegistrationResponseResult
// } from '../controllers/verification';

const router = express.Router();

router.post("/options", (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({
      status: "Error",
      message: "請填入使用者名稱"
    });
  }
  const userAuthenticators = getUserRegisteredAuthenticators<AuthenticatorDevice>(username);
  const options = {
    challenge: uuidv4(),
    rpId: process.env.RP_ID,
    rpName: process.env.RP_NAME,
    excludeCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credential_id,
      type: "public-key",
      transports: JSON.parse(authenticator.transports)
    }))
  };
  saveUserRegisterChallenge(username, options.challenge);
  res.status(200).json({
    status: "Success",
    data: {
      ...options
    }
  });
});

router.post(
  "/",
  async (
    req: Utilities.TypedRequest<
      unknown,
      {
        username: string;
        data: Register.PublicKeyCredentialAttestation;
      }
    >,
    res: Response
  ) => {
    const {
      username,
      data: {
        id,
        type,
        response: {
          publicKey,
          authenticatorData,
          clientDataJSON,
          transports,
          publicKeyAlgorithm,
          attestationObject
        }
      }
    } = req.body;
    if (
      !id ||
      !publicKey ||
      !username ||
      !clientDataJSON ||
      !authenticatorData ||
      !attestationObject
    ) {
      return res.status(403).json({
        status: "Error",
        message: "缺少必要資訊"
      });
    }

    const challenge = getUserRegisterChallenge(username);

    let verification: VerifiedRegistrationResponse;

    try {
      verification = await verifyRegistrationResponseAdapter({
        response: req.body.data,
        expectedChallenge: challenge.challenge,
        expectedOrigin: [process.env.ORIGIN_WEBSITE as string],
        expectedType: "webauthn.create",
        requireUserVerification: true
      });
    } catch (err) {
      return res.status(400).json({ status: "Error", message: (err as any).message });
    }

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      registerUserAuthenticator(
        username,
        Base64Url.encodeBase64Url(registrationInfo.credentialID),
        Base64Url.encodeBase64Url(registrationInfo.credentialPublicKey),
        registrationInfo.counter,
        JSON.stringify(transports)
      );

      clearUserRegisterChallenge(username);

      res.status(200).json({
        status: "Success"
      });
    } else {
      res.status(400).json({
        status: "Error"
      });
    }
  }
);

export default router;
