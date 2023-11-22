declare namespace WebAuthnClientType {
  type AlgoParams = -7 | -257;

  interface CommonOptions {
    timeout?: number;
    userVerification?: UserVerificationRequirement;
  }

  // create public key 的帶入資訊
  interface CreatePubKeyOptions extends CommonOptions {
    attestation?: AttestationConveyancePreference;
    authenticatorAttachment?: AuthenticatorAttachment;
    excludeCredentials?: PublicKeyCredentialDescriptor[];
    discoverable?: ResidentKeyRequirement;
  }

  // authenticate 帶入的資訊
  export interface AuthenticateOptions extends CommonOptions {
    mediation?: CredentialMediationRequirement;
    transport?: AuthenticatorTransport[];
  }
}
