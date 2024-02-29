import type {
  OmitPublicKeyCredentialRequestOptions,
  FatchedPublicKeyCredentialRequestOptions,
  FetchedPublicKeyCredentialDescriptor
} from "../../typings";
import { Base64Url } from "../base64";

// 產生簽章需要的參數
export class PublicKeyCredentialRequestOptionsTransform {
  challenge: string;
  allowCredentials?: FetchedPublicKeyCredentialDescriptor[];

  opts: Omit<FatchedPublicKeyCredentialRequestOptions, OmitPublicKeyCredentialRequestOptions>;
  constructor({ challenge, allowCredentials, ...opts }: FatchedPublicKeyCredentialRequestOptions) {
    this.challenge = challenge;
    this.allowCredentials = allowCredentials;
    this.opts = opts;
  }

  get options(): PublicKeyCredentialRequestOptions {
    return {
      challenge: Base64Url.decodeBase64Url(this.challenge),
      allowCredentials: this.allowCredentials?.map(({ id, type, transports }) => ({
        id: Base64Url.decodeBase64Url(id),
        type,
        transports
      })),
      ...this.opts
    };
  }
}
