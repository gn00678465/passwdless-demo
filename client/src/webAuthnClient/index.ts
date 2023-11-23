import { Base64Url } from '../utils';

export default class WebAuthnClient {
  constructor() {}

  static isAvailable(): boolean {
    return !!window.PublicKeyCredential;
  }

  static async isLocalAuthenticator() {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }

  static async createPublicKey(
    challenge: string,
    user: PublicKeyCredentialUserEntity,
    options?: WebAuthnClientType.CreatePubKeyOptions
  ): Promise<PublicKeyCredential | null> {
    options = options ?? {};
    const publicKeyCredential = await navigator.credentials.create({
      publicKey: new PublicKeyOptions(challenge, user, options).publicKeyOptions
    });
    if (!(publicKeyCredential instanceof PublicKeyCredential)) {
      throw new TypeError();
    }
    if (
      !(
        publicKeyCredential.response instanceof AuthenticatorAttestationResponse
      )
    ) {
      throw new TypeError('Unexpected attestation response');
    }

    return publicKeyCredential as PublicKeyCredential;
  }

  static async authenticate(
    credentialIds: string[],
    challenge: string,
    options?: WebAuthnClientType.AuthenticateOptions
  ): Promise<Credential | null> {
    options = options ?? {};
    const publicKeyCredential = await navigator.credentials.get({
      publicKey: new PublicKeyRequestOptions(credentialIds, challenge, options)
        .publicKeyRequestOptions
      // mediation: 'conditional'
    });

    if (!(publicKeyCredential instanceof PublicKeyCredential)) {
      throw new TypeError();
    }

    return publicKeyCredential;
  }
}

// 產生 public key 的參數
class PublicKeyOptions {
  challenge: string;
  user: PublicKeyCredentialUserEntity;
  options: WebAuthnClientType.CreatePubKeyOptions;
  constructor(
    challenge: string,
    user: PublicKeyCredentialUserEntity,
    options: WebAuthnClientType.CreatePubKeyOptions
  ) {
    this.challenge = challenge;
    this.user = user;
    this.options = options;
  }

  get publicKeyOptions(): PublicKeyCredentialCreationOptions {
    return {
      challenge: Base64Url.decodeBase64Url(this.challenge),
      rp: {
        name: window.location.hostname,
        id: window.location.hostname
      },
      user: this.user,
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },
        { alg: -257, type: 'public-key' }
      ],
      timeout: this.options?.timeout ?? 60000,
      excludeCredentials: this.options?.excludeCredentials,
      authenticatorSelection: {
        userVerification: this.options?.userVerification ?? 'required',
        residentKey: this.options?.discoverable ?? 'preferred',
        requireResidentKey: this.options?.discoverable === 'required',
        authenticatorAttachment: this.options?.authenticatorAttachment
      },
      attestation: this.options?.attestation ?? 'indirect'
    };
  }
}

// 驗證的參數
class PublicKeyRequestOptions {
  credentialIds: string[];
  challenge: string;
  options: WebAuthnClientType.AuthenticateOptions;
  constructor(
    credentialIds: string[],
    challenge: string,
    options: WebAuthnClientType.AuthenticateOptions
  ) {
    this.credentialIds = credentialIds;
    this.challenge = challenge;
    this.options = options;
  }

  get publicKeyRequestOptions(): PublicKeyCredentialRequestOptions {
    return {
      challenge: Base64Url.decodeBase64Url(this.challenge),
      rpId: window.location.hostname,
      allowCredentials: this.credentialIds.map((id) => ({
        id: Base64Url.decodeBase64Url(id),
        type: 'public-key',
        transports: this.options?.transport ?? [
          'hybrid',
          'usb',
          'ble',
          'nfc',
          'internal'
        ]
      })),
      timeout: this.options?.timeout ?? 60000,
      userVerification: this.options?.userVerification ?? 'required'
    };
  }
}

// 轉換
export class PublicKeyCredentialModel {
  authenticatorAttachment: string | null;
  id: string;
  rawId: ArrayBuffer;
  response: AuthenticatorAttestationResponse;
  type: string;
  username: string;
  constructor(credential: PublicKeyCredential, username: string) {
    this.authenticatorAttachment = credential.authenticatorAttachment;
    this.id = credential.id;
    this.rawId = credential.rawId;
    this.response = credential.response as AuthenticatorAttestationResponse;
    this.type = credential.type;
    this.username = username;
  }

  toJson() {
    const publicKey = this.response.getPublicKey();
    if (!publicKey) {
      throw new Error('Could not retrieve public key');
    }
    return {
      credential_id: this.id,
      public_key: Base64Url.encodeBase64Url(publicKey),
      username: this.username,
      authenticatorData: Base64Url.encodeBase64Url(
        this.response.getAuthenticatorData()
      ),
      clientData: Base64Url.encodeBase64Url(this.response.clientDataJSON)
    };
  }
}
