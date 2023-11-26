import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { VerifiedAuthenticationResponse } from '@simplewebauthn/server';

import db from '../db/index';
import { Base64Url, concatArrayBuffers, sha256 } from '../utils';
import {
  getUserRegisteredAuthenticators,
  saveUserAuthenticationChallenge,
  getUserAuthenticationChallenge,
  clearUserAuthenticationChallenge
} from '../controllers/database/database';
import { AuthenticatorDevice } from './types';
import { verifyAuthenticationResponseAdapter } from '../controllers/adapter/authentication';

const router = express.Router();

router.post('/options', async (req: Request, res: Response) => {
  const { username, user_verification } = req.body;
  if (!username) {
    return res.status(403).json({
      status: 'Error',
      message: '請輸入使用者名稱'
    });
  }
  const userAuthenticators =
    getUserRegisteredAuthenticators<AuthenticatorDevice>(username);

  if (!userAuthenticators || !userAuthenticators.length) {
    return res.status(400).json({
      status: 'Error',
      message: '使用者名稱不存在'
    });
  }
  const options = {
    challenge: uuidv4(),
    allowCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credential_id,
      type: 'public-key',
      transports: JSON.parse(authenticator.transports)
    }))
  };

  saveUserAuthenticationChallenge(username, options.challenge);

  res.status(200).json({
    status: 'Success',
    data: options
  });
});

type AuthenticateBody = Utilities.TypedRequest<
  unknown,
  { username: string; data: Authenticate.PublicKeyCredentialAssert }
>;

router.post('/', async (req: AuthenticateBody, res: Response) => {
  const username = req.body.username;
  const {
    id,
    rawId,
    authenticatorAttachment,
    type,
    response: { clientDataJSON, authenticatorData, signature, userHandle }
  } = req.body.data;
  if (!id || !signature || !authenticatorData || !rawId) {
    return res.status(400).json({
      status: 'Error',
      message: '缺少必要資訊'
    });
  }

  // (資料庫操作) 取得使用者目前的 challenge
  const expectedChallenge = getUserAuthenticationChallenge(username);

  // (資料庫操作) 從資料庫中檢查是否包含符合的驗證器
  const userAuthenticators =
    getUserRegisteredAuthenticators<AuthenticatorDevice>(username);

  const authenticator = userAuthenticators.find(
    (device) => device.credential_id === id
  );

  if (!authenticator) {
    return res.status(403).json({
      status: 'Error',
      message: 'User is not registered this device'
    });
  }
  // 執行驗證
  let verification: VerifiedAuthenticationResponse;

  try {
    verification = await verifyAuthenticationResponseAdapter(
      {
        response: req.body.data,
        expectedChallenge: expectedChallenge.challenge,
        expectedOrigin: [process.env.ORIGIN_WEBSITE as string],
        expectedType: 'webauthn.get',
        requireUserVerification: true,
        expectedRPID: process.env.RP_ID as string
      },
      {
        credentialID: new Uint8Array(
          Base64Url.decodeBase64Url(authenticator.credential_id)
        ),
        credentialPublicKey: new Uint8Array(
          Base64Url.decodeBase64Url(authenticator.public_key)
        ),
        counter: authenticator.counter,
        transports:
          authenticator.transports as unknown as Common.AuthenticatorTransportFuture[]
      }
    );
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(400).send({ error: error.message });
    }
    return res.status(400).send({ error: 'Unknown error' });
  }

  const { verified } = verification;

  if (verified) {
    return res.status(200).json({
      status: 'Success',
      data: {
        token: uuidv4()
      }
    });
  }

  return res.status(401).json({
    status: 'Error',
    message: '無法登入'
  });
});

export default router;

async function verifySignature(
  authenticatorData: string,
  clientData: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  const clientDataHash = await sha256(Base64Url.decodeBase64Url(clientData));
  const comboBuffer = concatArrayBuffers(
    Base64Url.decodeBase64Url(authenticatorData),
    clientDataHash
  );
  const signatureBuffer = Base64Url.decodeBase64Url(signature);
  const publicKeyBuffer = Base64Url.decodeBase64Url(publicKey);

  return await crypto.subtle.verify(
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    await crypto.subtle.importKey(
      'spki',
      publicKeyBuffer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256'
      },
      false,
      ['verify']
    ),
    signatureBuffer,
    comboBuffer
  );
}
