import { Base64Url } from '../utils';

export async function verifyRegistrationResponse({
  response: { clientData, authenticatorData, credential_id, public_key },
  expectedChallenge,
  expectedOrigin,
  requireUserVerification: boolean
}): Promise<any> {
  const utf8Decoder = new TextDecoder('utf-8');
  const decodedClientData = utf8Decoder.decode(
    Base64Url.decodeBase64Url(clientData)
  );
  const clientDataObj: { challenge: string; origin: string; type: string } =
    JSON.parse(decodedClientData);

  if (clientDataObj.challenge !== expectedChallenge) {
    throw new Error(`Invalid challenge`);
  }
  if (clientDataObj.origin !== expectedOrigin) {
    throw new Error(`Invalid origin`);
  }
  if (clientDataObj.type !== 'webauthn.create') {
    throw new Error(`Invalid type`);
  }

  let verified = true;

  return {
    verified,
    registrationInfo: {
      credentialId: credential_id,
      publicKey: public_key
    }
  };
}
