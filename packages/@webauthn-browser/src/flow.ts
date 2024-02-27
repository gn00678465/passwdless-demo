import { createCredential, getSignature } from "./webauthn";
import type { WebauthnRegistrationOptions, WebauthnAuthenticationOptions } from "./types";

/**
 * 建立 public key 流程
 * @param options
 */
export async function webauthnRegistration<TR>(options: WebauthnRegistrationOptions<TR>) {
  const { getPublicKeyCreationOptions, sendSignedChallenge, signal, ...opts } = options;
  try {
    const options = await getPublicKeyCreationOptions();
    const credential = await createCredential(options, { signal });
    const result = credential ? await sendSignedChallenge(credential) : null;
    opts?.onSuccess?.(result);
  } catch (error) {
    opts?.onError?.(error);
  } finally {
    opts?.onComplete?.();
  }
}

/**
 * 取得簽章流程
 * @param options
 */
export async function webauthnAuthentication<TR>(options: WebauthnAuthenticationOptions<TR>) {
  const { getPublicKeyRequestOptions, sendSignedChallenge, signal, ...opts } = options;
  try {
    const options = await getPublicKeyRequestOptions();
    const credential = await getSignature(options, { signal });
    const result = credential ? await sendSignedChallenge(credential) : null;
    opts?.onSuccess?.(result);
  } catch (error) {
    opts?.onError?.(error);
  } finally {
    opts?.onComplete?.();
  }
}

export async function passkeysAuthentication<TR>(options: WebauthnAuthenticationOptions<TR>) {
  const { getPublicKeyRequestOptions, sendSignedChallenge, signal, ...opts } = options;
  try {
    const options = await getPublicKeyRequestOptions();
    const credential = await getSignature(options, { signal, mediation: "conditional" });
    const result = credential ? await sendSignedChallenge(credential) : null;
    opts?.onSuccess?.(result);
  } catch (error) {
    opts?.onError?.(error);
  } finally {
    opts?.onComplete?.();
  }
}
