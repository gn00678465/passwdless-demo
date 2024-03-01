import type { AuthenticationExtensionsClientOutputsJSON } from "./common.type";
import { AuthenticatorTransportFuture } from "../CredentialOptionsJSON";

/**
 * 前端產生 public credential 後轉換為 JSON 格式
 */
export interface RegistrationResponseJSON {
  id: string;
  rawId: string;
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
  clientDataJSON: string;
  authenticatorData: string;
  transports: AuthenticatorTransportFuture[];
  attestationObject: string;
  publicKey: string;
  publicKeyAlgorithm: number;
}
