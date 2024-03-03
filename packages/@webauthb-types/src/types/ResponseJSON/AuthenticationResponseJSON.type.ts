import { Base64UrlString } from "../common";
import type { AuthenticationExtensionsClientOutputsJSON } from "./common.type";

/**
 * 前端產生 signature 後轉換為 JSON 格式
 */
export interface AuthenticationResponseJSON {
  id: Base64UrlString;
  rawId: Base64UrlString;
  response: AuthenticatorAssertionResponseJSON;
  authenticatorAttachment?: AuthenticatorAttachment;
  clientExtensionResults: AuthenticationExtensionsClientOutputsJSON;
  type: "public-key";
}

type OmitAuthenticatorAssertionResponse =
  | "clientDataJSON"
  | "authenticatorData"
  | "signature"
  | "userHandle";

export interface AuthenticatorAssertionResponseJSON
  extends Omit<AuthenticatorAssertionResponse, OmitAuthenticatorAssertionResponse> {
  clientDataJSON: Base64UrlString;
  authenticatorData: Base64UrlString;
  signature: Base64UrlString;
  userHandle?: Base64UrlString;
}
