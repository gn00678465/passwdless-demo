import { createCredentialVerification, getCredentialVerification } from "./utility";
import type { PublicKeyOptions, GetPublicKeyOptions } from "./types";

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
  publicKey: PublicKeyCredentialCreationOptions,
  options: PublicKeyOptions = {}
): Promise<PublicKeyCredential | null> {
  const publicKeyCredential = await navigator.credentials.create({
    publicKey: publicKey,
    signal: options?.signal ?? undefined
  });

  if (!createCredentialVerification(publicKeyCredential) || !publicKeyCredential) return null;

  return publicKeyCredential as PublicKeyCredential;
}

/**
 * 取得 credential public key 等驗證資訊
 * @param {PublicKeyCredentialRequestOptions} publicKey
 * @returns {Promise<PublicKeyCredential | null>}
 */
export async function getCredential(
  publicKey: PublicKeyCredentialRequestOptions,
  options: GetPublicKeyOptions = {}
): Promise<PublicKeyCredential | null> {
  const publicKeyCredential = await navigator.credentials.get({
    publicKey: publicKey,
    signal: options?.signal ?? undefined,
    mediation: options?.mediation ?? undefined
  });

  if (!getCredentialVerification(publicKeyCredential) || !publicKeyCredential) return null;

  return publicKeyCredential as PublicKeyCredential;
}

/**
 * 取得 credential public key 等驗證資訊(With Condition UI)
 * @param {PublicKeyCredentialRequestOptions} publicKey
 * @returns {Promise<PublicKeyCredential | null>}
 */
export async function getConditionalCredential(
  publicKey: PublicKeyCredentialRequestOptions,
  options: PublicKeyOptions = {}
): Promise<PublicKeyCredential | null> {
  return getCredential(publicKey, {
    signal: options?.signal ?? undefined,
    mediation: "conditional"
  });
}
