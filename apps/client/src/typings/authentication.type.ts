import type { FetchedPublicKeyCredentialDescriptor } from "./common.type";

export type OmitPublicKeyCredentialRequestOptions = "challenge" | "allowCredentials";

export interface FatchedPublicKeyCredentialRequestOptions
  extends Omit<PublicKeyCredentialRequestOptions, OmitPublicKeyCredentialRequestOptions> {
  challenge: string;
  allowCredentials?: FetchedPublicKeyCredentialDescriptor[];
}
