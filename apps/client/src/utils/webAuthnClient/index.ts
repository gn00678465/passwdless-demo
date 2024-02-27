import { Base64Url } from "../base64";
import { PublicKeyCredentialAttestation, PublicKeyCredentialAssert } from "./types";

export default class WebAuthnClient {
  constructor() {}

  static isAvailable(): boolean {
    return !!window.PublicKeyCredential;
  }

  static async isLocalAuthenticator() {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }

  static async createPublicKey(
    publicKey: PublicKeyCredentialCreationOptions
  ): Promise<PublicKeyCredential | null> {
    const publicKeyCredential = await navigator.credentials.create({
      publicKey: publicKey
    });
    if (!(publicKeyCredential instanceof PublicKeyCredential)) {
      throw new TypeError();
    }
    if (!(publicKeyCredential.response instanceof AuthenticatorAttestationResponse)) {
      throw new TypeError("Unexpected attestation response");
    }

    return publicKeyCredential as PublicKeyCredential;
  }

  static async authenticate(
    publicKey: PublicKeyCredentialRequestOptions
  ): Promise<PublicKeyCredential | null> {
    const publicKeyCredential = await navigator.credentials.get({
      publicKey: publicKey
    });

    if (!(publicKeyCredential instanceof PublicKeyCredential)) {
      throw new TypeError();
    }

    return publicKeyCredential as PublicKeyCredential;
  }
}

// 產生 public key 的參數
export class PublicKeyOptions {
  challenge: string;
  user: PublicKeyCredentialUserEntity;
  rpId: string;
  rpName: string;
  options: WebAuthnClientType.CreatePubKeyOptions;
  constructor(
    challenge: string,
    user: PublicKeyCredentialUserEntity,
    rpId: string,
    rpName: string,
    options?: WebAuthnClientType.CreatePubKeyOptions
  ) {
    this.challenge = challenge;
    this.user = user;
    this.rpId = rpId;
    this.rpName = rpName;
    this.options = options ?? {};
  }

  get publicKeyOptions(): PublicKeyCredentialCreationOptions {
    return {
      challenge: Base64Url.decodeBase64Url(this.challenge),
      rp: {
        name: this.rpName,
        id: this.rpId
      },
      user: this.user,
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },
        { alg: -257, type: "public-key" }
      ],
      timeout: this.options?.timeout ?? 60000,
      excludeCredentials: this.options?.excludeCredentials,
      authenticatorSelection: {
        userVerification: this.options?.userVerification ?? "required",
        residentKey: this.options?.discoverable ?? "preferred",
        requireResidentKey: this.options?.discoverable === "required",
        authenticatorAttachment: this.options?.authenticatorAttachment
      },
      attestation: this.options?.attestation ?? "indirect"
    };
  }
}

// 產生驗證的參數
export class PublicKeyRequestOptions {
  challenge: string;
  options: WebAuthnClientType.AuthenticateOptions;
  rpId: string;
  constructor(challenge: string, rpId: string, options?: WebAuthnClientType.AuthenticateOptions) {
    this.challenge = challenge;
    this.options = options ?? {};
    this.rpId = rpId;
  }

  get publicKeyRequestOptions(): PublicKeyCredentialRequestOptions {
    return {
      challenge: Base64Url.decodeBase64Url(this.challenge),
      rpId: window.location.hostname,
      allowCredentials: this.options?.allowCredentials ?? [],
      timeout: this.options?.timeout ?? 60000,
      userVerification: this.options?.userVerification ?? "required"
    };
  }
}

// 產生為 passkey credential
export class ConditionalPublicKeyRequestOptions {
  challenge: string;
  options: WebAuthnClientType.AuthenticateOptions;
  constructor(challenge: string, options?: WebAuthnClientType.AuthenticateOptions) {
    this.challenge = challenge;
    this.options = options ?? {};
  }

  get publicKeyRequestOptions(): PublicKeyCredentialRequestOptions {
    return {
      challenge: Base64Url.decodeBase64Url(this.challenge),
      rpId: window.location.hostname,
      allowCredentials: this.options?.allowCredentials ?? [],
      userVerification: this.options?.userVerification ?? "required"
    };
  }
}

// 轉換註冊用格式
export class PublicKeyCredentialAttestationAdapter {
  authenticatorAttachment: string | null;
  id: string;
  rawId: ArrayBuffer;
  response: AuthenticatorAttestationResponse;
  type: string;
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  constructor(credential: PublicKeyCredential) {
    this.authenticatorAttachment = credential.authenticatorAttachment;
    this.id = credential.id;
    this.rawId = credential.rawId;
    this.response = credential.response as AuthenticatorAttestationResponse;
    this.type = credential.type;
    this.clientExtensionResults = credential.getClientExtensionResults();
  }

  #toAttestationJson(
    instance: PublicKeyCredentialAttestationAdapter,
    publicKey: ArrayBuffer
  ): PublicKeyCredentialAttestation {
    return {
      id: instance.id,
      rawId: Base64Url.encodeBase64Url(instance.rawId),
      authenticatorAttachment: instance.authenticatorAttachment,
      response: {
        publicKey: Base64Url.encodeBase64Url(publicKey),
        authenticatorData: Base64Url.encodeBase64Url(instance.response.getAuthenticatorData()),
        clientDataJSON: Base64Url.encodeBase64Url(instance.response.clientDataJSON),
        transports: instance.response.getTransports(),
        publicKeyAlgorithm: instance.response.getPublicKeyAlgorithm(),
        attestationObject: Base64Url.encodeBase64Url(instance.response.attestationObject)
      },
      clientExtensionResults: instance.clientExtensionResults,
      type: instance.type
    };
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
  type: string;
  authenticatorAttachment: string | null;
  constructor(credential: PublicKeyCredential) {
    this.id = credential.id;
    this.rawId = credential.rawId;
    this.response = credential.response as AuthenticatorAssertionResponse;
    this.type = credential.type;
    this.authenticatorAttachment = credential.authenticatorAttachment;
  }

  toJson() {
    return this.#toAssertionJson(this);
  }

  #toAssertionJson(instance: PublicKeyCredentialAssertionAdapter): PublicKeyCredentialAssert {
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
    };
  }
}

export * from "./types";
