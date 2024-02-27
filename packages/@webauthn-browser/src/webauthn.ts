import { createCredentialVerification, getCredentialVerification } from "./utility";
import type { CreateCredentialOptions, GetSignatureOptions } from "./types";

/**
 * 偵測是否支援 WebAuthn
 * @returns {boolean}
 */
function isAvailable(): boolean {
  return !!window.PublicKeyCredential;
}

/**
 * 偵測是否支援 WebAuthn
 * @returns {Promise<boolean>}
 */
export async function isLocalAuthenticator(): Promise<boolean> {
  return (
    isAvailable() &&
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
    (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())
  );
}

/**
 * 偵測是否支援 Conditional Mediation
 * @returns {Promise<boolean>}
 */
export async function isCMA(): Promise<boolean> {
  return (
    isAvailable() &&
    PublicKeyCredential.isConditionalMediationAvailable &&
    (await PublicKeyCredential.isConditionalMediationAvailable())
  );
}

/**
 * 建立 credential public key
 * @param {PublicKeyCredentialCreationOptions} publicKey
 * @returns {Promise<PublicKeyCredential | null>}
 */
export async function createCredential(
  publicKey: PublicKeyCredentialCreationOptions | undefined,
  options: CreateCredentialOptions = {}
): Promise<PublicKeyCredential | null> {
  const credential = await navigator.credentials.create({
    publicKey: publicKey,
    signal: options?.signal ?? undefined
  });

  if (!createCredentialVerification(credential) || !credential) return null;

  return credential as PublicKeyCredential;
}

/**
 * 建立簽章等驗證資訊
 * @param {PublicKeyCredentialRequestOptions} publicKey
 * @returns {Promise<PublicKeyCredential | null>}
 */
export async function getSignature(
  publicKey: PublicKeyCredentialCreationOptions | undefined,
  options: GetSignatureOptions = {}
): Promise<PublicKeyCredential | null> {
  const credential = await navigator.credentials.get({
    publicKey: publicKey,
    signal: options?.signal ?? undefined,
    mediation: options?.mediation ?? undefined
  });

  if (!getCredentialVerification(credential) || !credential) return null;

  return credential as PublicKeyCredential;
}
