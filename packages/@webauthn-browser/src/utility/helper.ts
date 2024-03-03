export function createCredentialVerification(publicKeyCredential: Credential | null) {
  if (!(publicKeyCredential instanceof PublicKeyCredential)) {
    throw new TypeError("Unexpected PublicKeyCredential type");
  }
  if (!(publicKeyCredential.response instanceof AuthenticatorAttestationResponse)) {
    throw new TypeError("Unexpected attestation response");
  }

  return true;
}

export function getCredentialVerification(publicKeyCredential: Credential | null) {
  if (!(publicKeyCredential instanceof PublicKeyCredential)) {
    throw new TypeError("Unexpected PublicKeyCredential type");
  }

  if (!(publicKeyCredential.response instanceof AuthenticatorAssertionResponse)) {
    throw new TypeError("Unexpected assertion response");
  }

  return true;
}
