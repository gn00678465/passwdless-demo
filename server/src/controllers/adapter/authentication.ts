import {
  verifyAuthenticationResponse,
  VerifiedAuthenticationResponse
} from '@simplewebauthn/server';

export interface VerifyAuthenticationResponseOptions {
  response: Authenticate.PublicKeyCredentialAssert;
  expectedChallenge: string;
  expectedOrigin: string | string[];
  expectedType: 'webauthn.create' | 'webauthn.get' | (string & {});
  requireUserVerification: boolean;
  expectedRPID: string;
}

export async function verifyAuthenticationResponseAdapter(
  {
    response: {
      id,
      type,
      rawId,
      response: { clientDataJSON, authenticatorData, signature },
      clientExtensionResults
    },
    expectedOrigin,
    expectedChallenge,
    expectedType,
    expectedRPID,
    requireUserVerification
  }: VerifyAuthenticationResponseOptions,
  authenticator: Common.AuthenticatorDevice
): Promise<VerifiedAuthenticationResponse> {
  return await verifyAuthenticationResponse({
    response: {
      id,
      rawId,
      type,
      response: { clientDataJSON, authenticatorData, signature },
      clientExtensionResults
    },
    expectedChallenge,
    expectedOrigin,
    expectedType,
    requireUserVerification,
    expectedRPID,
    authenticator: authenticator
  });
}
