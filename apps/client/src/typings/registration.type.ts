export interface FetchedPublicKeyCredentialUserEntity {
  displayName: string;
  id: string;
  name: string;
}

export interface FetchedPublicKeyCredentialDescriptor {
  id: string;
  transports?: AuthenticatorTransport[];
  type: PublicKeyCredentialType;
}

export type OmitPublicKeyCredentialCreationOptions = "challenge" | "user" | "excludeCredentials";

export interface FetchedPublicKeyCredentialCreationOptions
  extends Omit<PublicKeyCredentialCreationOptions, OmitPublicKeyCredentialCreationOptions> {
  challenge: string;
  user: FetchedPublicKeyCredentialUserEntity;
  excludeCredentials: FetchedPublicKeyCredentialDescriptor[];
}
