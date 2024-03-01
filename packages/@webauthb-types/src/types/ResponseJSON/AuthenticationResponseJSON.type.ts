import type { AuthenticationExtensionsClientOutputsJSON } from "./common.type";

/**
 * 前端產生 signature 後轉換為 JSON 格式
 */
export interface AuthenticationResponseJSON {
  id: string;
  rawId: string;
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
  clientDataJSON: string;
  authenticatorData: string;
  signature: string;
  userHandle?: string;
}
