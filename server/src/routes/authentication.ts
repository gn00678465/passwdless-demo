import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/index';
import { Base64Url, concatArrayBuffers, sha256 } from '../utils';

const router = express.Router();

router.post('/options', async (req: Request, res: Response) => {
  const { username, user_verification } = req.body;
  if (!username) {
    return res.status(403).json({
      status: 'Error',
      message: '請輸入使用者名稱'
    });
  }
  const stmt = db.prepare<string[]>(
    'SELECT credential_id FROM auth WHERE username = ?'
  );
  const credential_id = stmt.get(username);
  if (!credential_id) {
    return res.status(403).json({
      status: 'Error',
      message: '使用者名稱不存在'
    });
  }
  res.status(200).json({
    status: 'Success',
    data: { challenge: uuidv4(), ...credential_id }
  });
});

router.post('/signature', async (req: Request, res: Response) => {
  const { signature, credential_id, authenticatorData, clientData } = req.body;
  if (!credential_id || !signature || !authenticatorData || !clientData) {
    return res.status(403).json({
      status: 'Error',
      message: '缺少必要資訊'
    });
  }
  const stmt = db.prepare<string[]>(
    'SELECT public_key FROM auth WHERE credential_id = ?'
  );
  const dbResult = (await stmt.get(credential_id)) as {
    public_key: string;
  } | null;
  if (!dbResult) {
    return res.status(403).json({
      status: 'Error',
      message: 'Credential not exist'
    });
  }
  const isValid = await verifySignature(
    authenticatorData,
    clientData,
    signature,
    dbResult.public_key
  );

  if (isValid) {
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
