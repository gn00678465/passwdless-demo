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

export interface PublicKeyCredentialAssert {
  id: string;
  rawId: string;
  authenticatorAttachment: string | null;
  type: string;
  response: {
    clientDataJSON: string;
    authenticatorData: string;
    signature: string;
    userHandle: string | null;
  };
}
