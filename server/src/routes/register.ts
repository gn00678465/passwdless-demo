import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Authenticator } from './types';
import {
  getUserRegisteredAuthenticators,
  saveUserRegisterChallenge,
  getUserRegisterChallenge,
  clearUserRegisterChallenge,
  registerUserAuthenticator
} from '../controllers/database';
import { verifyRegistrationResponse } from '../controllers/verification';

const router = express.Router();

router.post('/options', (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({
      status: 'Error',
      message: '請填入使用者名稱'
    });
  }
  const userAuthenticators =
    getUserRegisteredAuthenticators<Authenticator>(username);
  const options = {
    challenge: uuidv4(),
    rpId: process.env.RP_ID,
    rpName: process.env.RP_NAME,
    excludeCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credential_id,
      type: 'public-key',
      transports: JSON.parse(authenticator.transports)
    }))
  };
  saveUserRegisterChallenge(username, options.challenge);
  res.status(200).json({
    status: 'Success',
    data: {
      options
    }
  });
});

router.post('/', async (req: Request, res: Response) => {
  const {
    credential_id,
    public_key,
    username,
    authenticatorData,
    clientData,
    transports,
    algorithm
  } = req.body;
  if (!credential_id || !public_key || !username) {
    return res.status(403).json({
      status: 'Error',
      message: '缺少必要資訊'
    });
  }

  const challenge = getUserRegisterChallenge(username);

  let verification;

  try {
    verification = await verifyRegistrationResponse({
      response: {
        clientData,
        authenticatorData,
        credential_id,
        public_key
      },
      expectedChallenge: (challenge as any).challenge,
      expectedOrigin: 'http://localhost:5173',
      requireUserVerification: true
    });
  } catch (err) {
    return res
      .status(400)
      .json({ status: 'Error', message: (err as any).message });
  }

  const { verified, registrationInfo } = verification;

  if (verified && registrationInfo) {
    registerUserAuthenticator(
      username,
      registrationInfo.credentialId,
      registrationInfo.publicKey,
      JSON.stringify(transports),
      algorithm
    );

    clearUserRegisterChallenge(username);

    res.status(200).json({
      status: 'Success'
    });
  }
});

export default router;
