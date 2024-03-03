import { Base64UrlString } from "../common";
import type { AuthenticationExtensionsClientOutputsJSON } from "./common.type";
import { AuthenticatorTransportFuture } from "../CredentialOptionsJSON";

/**
 * 前端產生 public credential 後轉換為 JSON 格式
 */
export interface RegistrationResponseJSON {
  id: Base64UrlString;
  rawId: Base64UrlString;
  response: AuthenticatorAttestationResponseJSON;
  clientExtensionResults: AuthenticationExtensionsClientOutputsJSON;
  authenticatorAttachment?: AuthenticatorAttachment;
  type: "public-key";
}

type OmitAuthenticatorAttestationResponse =
  | "clientDataJSON"
  | "authenticatorData"
  | "transports"
  | "publicKey"
  | "attestationObject"
  | "publicKeyAlgorithm";

export interface AuthenticatorAttestationResponseJSON
  extends Omit<AuthenticatorAttestationResponse, OmitAuthenticatorAttestationResponse> {
  clientDataJSON: Base64UrlString;
  authenticatorData: Base64UrlString;
  transports: AuthenticatorTransportFuture[];
  attestationObject: Base64UrlString;
  publicKey: Base64UrlString;
  publicKeyAlgorithm: number;
}
