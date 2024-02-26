export interface PublicKeyOptions {
  signal?: AbortSignal;
}

export interface GetPublicKeyOptions extends PublicKeyOptions {
  mediation?: CredentialMediationRequirement;
}
