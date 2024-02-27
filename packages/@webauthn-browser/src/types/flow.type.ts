import type { CreateCredentialOptions } from "./webauthn.type";

interface CommonOptions extends CreateCredentialOptions {
  onError?: (error: unknown) => void;
  onSuccess?: <T>(arg: T) => void;
  onComplete?: () => void;
}

export interface WebauthnRegistrationOptions extends CommonOptions {
  getPublicKeyCreationOptions: () => Promise<PublicKeyCredentialCreationOptions | undefined>;
  sendSignedChallenge: <T>(arg: PublicKeyCredential | null) => Promise<T>;
}

export interface WebauthnAuthenticationOptions extends CommonOptions {
  getPublicKeyRequestOptions: () => Promise<PublicKeyCredentialCreationOptions | undefined>;
  sendSignedChallenge: <T>(arg: PublicKeyCredential | null) => Promise<T>;
}
