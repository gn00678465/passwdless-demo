declare namespace WebAuthnClientType {
  type AlgoParams = -7 | -257;

  interface CommonOptions {
    authenticatorAttachment?: AuthenticatorAttachment;
    timeout?: number;
    userVerification?: UserVerificationRequirement;
    attestation?: AttestationConveyancePreference;
  }

  interface CreatePubKeyOptions extends CommonOptions {
    excludeCredentials?: PublicKeyCredentialDescriptor[];
    discoverable?: ResidentKeyRequirement;
  }
}
