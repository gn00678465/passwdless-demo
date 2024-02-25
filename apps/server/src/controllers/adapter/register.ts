import {
  verifyRegistrationResponse,
  VerifiedRegistrationResponse
} from '@simplewebauthn/server';

export interface VerifyRegistrationResponseOptions {
  response: Register.PublicKeyCredentialAttestation;
  expectedChallenge: string;
  expectedOrigin: string | string[];
  expectedType: 'webauthn.create' | 'webauthn.get' | (string & {});
  requireUserVerification: boolean;
}

export async function verifyRegistrationResponseAdapter({
  response: {
    id,
    type,
    rawId,
    clientExtensionResults,
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
}: VerifyRegistrationResponseOptions): Promise<VerifiedRegistrationResponse> {
  return await verifyRegistrationResponse({
    response: {
      id,
      type,
      response: {
        clientDataJSON: clientDataJSON,
        attestationObject,
        publicKey,
        publicKeyAlgorithm,
        authenticatorData
      },
      rawId,
      clientExtensionResults
    },
    expectedChallenge,
    expectedOrigin,
    expectedType,
    requireUserVerification
  });
}
