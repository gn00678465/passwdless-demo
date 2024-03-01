import { Base64Url } from ".";
import {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture
} from "@webauthn/types";

// 轉換註冊用格式
export class PublicKeyCredentialAttestationAdapter {
  authenticatorAttachment: AuthenticatorAttachment | undefined;
  id: string;
  rawId: ArrayBuffer;
  response: AuthenticatorAttestationResponse;
  type: "public-key";
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  constructor(credential: PublicKeyCredential) {
    this.authenticatorAttachment = credential.authenticatorAttachment as AuthenticatorAttachment;
    this.id = credential.id;
    this.rawId = credential.rawId;
    this.response = credential.response as AuthenticatorAttestationResponse;
    this.type = credential.type as "public-key";
    this.clientExtensionResults = credential.getClientExtensionResults();
  }

  #toAttestationJson(instance: PublicKeyCredentialAttestationAdapter, publicKey: ArrayBuffer) {
    return {
      id: instance.id,
      rawId: Base64Url.encodeBase64Url(instance.rawId),
      authenticatorAttachment: instance.authenticatorAttachment,
      response: {
        publicKey: Base64Url.encodeBase64Url(publicKey),
        authenticatorData: Base64Url.encodeBase64Url(instance.response.getAuthenticatorData()),
        clientDataJSON: Base64Url.encodeBase64Url(instance.response.clientDataJSON),
        transports: instance.response.getTransports() as AuthenticatorTransportFuture[],
        publicKeyAlgorithm: instance.response.getPublicKeyAlgorithm(),
        attestationObject: Base64Url.encodeBase64Url(instance.response.attestationObject)
      },
      clientExtensionResults: instance.clientExtensionResults,
      type: instance.type
    } as unknown as RegistrationResponseJSON;
  }

  toJson() {
    const publicKey = this.response.getPublicKey();
    if (!publicKey) {
      throw new Error("Could not retrieve public key");
    }
    return this.#toAttestationJson(this, publicKey);
  }
}

// 轉換登入用格式
export class PublicKeyCredentialAssertionAdapter {
  id: string;
  rawId: ArrayBuffer;
  response: AuthenticatorAssertionResponse;
  type: "public-key";
  authenticatorAttachment: AuthenticatorAttachment | undefined;
  constructor(credential: PublicKeyCredential) {
    this.id = credential.id;
    this.rawId = credential.rawId;
    this.response = credential.response as AuthenticatorAssertionResponse;
    this.type = credential.type as "public-key";
    this.authenticatorAttachment = credential.authenticatorAttachment as AuthenticatorAttachment;
  }

  toJson() {
    return this.#toAssertionJson(this);
  }

  #toAssertionJson(instance: PublicKeyCredentialAssertionAdapter) {
    return {
      id: instance.id,
      rawId: Base64Url.encodeBase64Url(instance.rawId),
      response: {
        clientDataJSON: Base64Url.encodeBase64Url(instance.response.clientDataJSON),
        signature: Base64Url.encodeBase64Url(instance.response.signature),
        userHandle:
          instance.response.userHandle && Base64Url.encodeBase64Url(instance.response.userHandle),
        authenticatorData: Base64Url.encodeBase64Url(instance.response.authenticatorData)
      },
      type: instance.type,
      authenticatorAttachment: instance.authenticatorAttachment
    } as unknown as AuthenticationResponseJSON;
  }
}
