export interface CreateCredentialOptions {
  /** 中斷請求 */
  signal?: AbortSignal;
}

export interface GetSignatureOptions extends CreateCredentialOptions {
  mediation?: CredentialMediationRequirement;
}
