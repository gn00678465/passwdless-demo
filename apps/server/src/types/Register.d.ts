declare namespace Register {
  type PublicKeyCredentialAttestationKeys = keyof Omit<
    PublicKeyCredential,
    | 'response'
    | 'getClientExtensionResults'
    | 'rawId'
    | 'authenticatorAttachment'
    | 'type'
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
    type: 'public-key';
  }
}
