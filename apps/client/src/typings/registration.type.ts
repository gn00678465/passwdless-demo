import type { FetchedPublicKeyCredentialDescriptor } from "./common.type";

export interface FetchedPublicKeyCredentialUserEntity {
  displayName: string;
  id: string;
  name: string;
}

export type OmitPublicKeyCredentialCreationOptions = "challenge" | "user" | "excludeCredentials";

export interface FetchedPublicKeyCredentialCreationOptions
  extends Omit<PublicKeyCredentialCreationOptions, OmitPublicKeyCredentialCreationOptions> {
  challenge: string;
  user: FetchedPublicKeyCredentialUserEntity;
  excludeCredentials?: FetchedPublicKeyCredentialDescriptor[];
}
