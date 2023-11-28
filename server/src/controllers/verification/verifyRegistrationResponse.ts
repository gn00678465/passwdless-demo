import { Base64Url } from '../../utils';
import { decodeClientDataJSON } from '../helpers/decodeClientDataJSON';
import { decodeAttestationObject } from '../helpers/decodeAttestationObject';

export interface VerifyRegistrationResponseOptions {
  response: Register.PublicKeyCredentialAttestation;
  expectedChallenge: string;
  expectedOrigin: string | string[];
  expectedType: 'webauthn.create' | 'webauthn.get' | (string & {});
  requireUserVerification: boolean;
}

interface RegistrationInfo {
  credentialId: string;
  publicKey: string;
}

export interface VerifyRegistrationResponseResult {
  verified: boolean;
  registrationInfo: RegistrationInfo;
}

export async function verifyRegistrationResponse({
  response: {
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
  },
  expectedChallenge,
  expectedOrigin,
  expectedType,
  requireUserVerification
}: VerifyRegistrationResponseOptions): Promise<VerifyRegistrationResponseResult> {
  if (!id) throw new Error('Missing credential ID');

  if (type !== 'public-key')
    throw new Error(
      `Unexpected credential type ${type}, expected "public-key"`
    );

  // 驗證 client data json
  const clientDataObj = decodeClientDataJSON(clientDataJSON);

  // 驗證 challenge
  if (clientDataObj.challenge !== expectedChallenge) {
    throw new Error(
      `Unexpected authentication response challenge "${clientDataObj.challenge}", expected "${expectedChallenge}"`
    );
  }
  if (clientDataObj.type !== expectedType) {
    throw new Error(
      `Unexpected authentication response type "${clientDataObj.type}", expected "${expectedType}"`
    );
  }
  // 驗證 origin website
  if (Array.isArray(expectedOrigin)) {
    if (!expectedOrigin.includes(clientDataObj.origin)) {
      const joinedExpectedOrigin = expectedOrigin.join(', ');
      throw new Error(
        `Unexpected authentication response origin "${origin}", expected one of: ${joinedExpectedOrigin}`
      );
    }
  } else {
    if (clientDataObj.origin !== expectedOrigin) {
      throw new Error(
        `Unexpected authentication response origin "${origin}", expected "${expectedOrigin}"`
      );
    }
  }

  const attestationObj = decodeAttestationObject(attestationObject);

  let verified = true;

  return {
    verified,
    registrationInfo: {
      credentialId: id,
      publicKey: publicKey
    }
  };
}
