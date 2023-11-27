import { Base64Url, sha256, concatArrayBuffers } from '../../utils';

interface VerifySignatureOptions {
  signature: string;
  clientDataJSON: string;
  authenticatorData: string;
  publicKey: string;
}

async function verifySignature(
  options: VerifySignatureOptions
): Promise<boolean>;
async function verifySignature({
  signature,
  clientDataJSON,
  authenticatorData,
  publicKey
}: VerifySignatureOptions): Promise<boolean> {
  const clientDataHash = await sha256(
    Base64Url.decodeBase64Url(clientDataJSON)
  );
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
      true,
      ['verify']
    ),
    signatureBuffer,
    comboBuffer
  );
}

export { verifySignature };
