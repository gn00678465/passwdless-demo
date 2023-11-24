type PublicKeyCredentialAttestationKeys = keyof Omit<
  PublicKeyCredential,
  'response' | 'getClientExtensionResults' | 'rawId' | 'authenticatorAttachment'
>;

export interface PublicKeyCredentialAttestation
  extends Record<PublicKeyCredentialAttestationKeys, string> {
  authenticatorAttachment: string | null;
  rawId: string;
  response: {
    publicKey: string;
    authenticatorData: string;
    clientDataJSON: string;
    transports: string[];
    publicKeyAlgorithm: number;
    attestationObject: string;
  };
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
}

type PublicKeyCredentialAssertKeys =
  | 'credential_id'
  | 'authenticatorData'
  | 'clientData'
  | 'signature';

export type PublicKeyCredentialAssert = Record<
  PublicKeyCredentialAssertKeys,
  string
> & { userHandle: string | null };
