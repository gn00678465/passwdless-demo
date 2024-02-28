import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { VerifiedAuthenticationResponse } from "@simplewebauthn/server";

import { Base64Url, concatArrayBuffers, sha256 } from "../utils";
import {
  getUserRegisteredAuthenticators,
  saveUserAuthenticationChallenge,
  getUserAuthenticationChallenge,
  clearUserAuthenticationChallenge
} from "../controllers/database/database";
import { AuthenticatorDevice } from "./types";
import { verifyAuthenticationResponseAdapter } from "../controllers/adapter/authentication";

import { decodeClientDataJSON, decodeUserHandle } from "@webauthn/server";

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  const options = {
    challenge: uuidv4(),
    allowCredentials: [],
    rpId: process.env.RP_ID,
    extensions: {}
  };

  res.status(200).json({
    status: "Success",
    data: options
  });
});

router.put("/login", async (req: Request, res: Response) => {
  const {
    id,
    rawId,
    authenticatorAttachment,
    type,
    response: { clientDataJSON, authenticatorData, signature, userHandle }
  } = req.body.data;

  if (!id || !signature || !authenticatorData || !rawId) {
    return res.status(400).json({
      status: "Error",
      message: "缺少必要資訊"
    });
  }

  console.log("🚀 ~ router.put ~ userHandle:", userHandle);

  res.status(200).json({
    status: "Success",
    data: req.body.data
  });
});

export default router;
