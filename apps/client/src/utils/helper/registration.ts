import type {
  FetchedPublicKeyCredentialCreationOptions,
  FetchedPublicKeyCredentialUserEntity,
  OmitPublicKeyCredentialCreationOptions,
  FetchedPublicKeyCredentialDescriptor
} from "../../typings";
import { Base64Url } from "../base64";

// 產生 public key 的參數
export class PublicKeyCredentialCreationOptionsTransform {
  challenge: string;
  user: FetchedPublicKeyCredentialUserEntity;
  excludeCredentials: FetchedPublicKeyCredentialDescriptor[];

  opts: Omit<PublicKeyCredentialCreationOptions, OmitPublicKeyCredentialCreationOptions>;
  constructor({
    challenge,
    user,
    excludeCredentials,
    ...opts
  }: FetchedPublicKeyCredentialCreationOptions) {
    this.challenge = challenge;
    this.opts = opts;
    this.user = user;
    this.excludeCredentials = excludeCredentials;
  }

  get options(): PublicKeyCredentialCreationOptions {
    return {
      challenge: Base64Url.decodeBase64Url(this.challenge),
      user: {
        ...this.user,
        id: Base64Url.decodeBase64Url(this.user.id)
      },
      excludeCredentials: this.excludeCredentials.map((credential) => ({
        id: Base64Url.decodeBase64Url(credential.id),
        type: credential.type,
        transports: credential.transports
      })),
      ...this.opts
    };
  }
}
