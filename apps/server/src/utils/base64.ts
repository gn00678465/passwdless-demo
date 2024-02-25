import base64 from '@hexagon/base64';

export class Base64Url {
  constructor() {}

  static encodeBase64Url(buffer: ArrayBuffer): string {
    return base64.fromArrayBuffer(buffer, true);
  }

  static decodeBase64Url(base64url: string): ArrayBuffer {
    return base64.toArrayBuffer(base64url, true);
  }

  static isBase64Url(base64url: string): boolean {
    return base64.validate(base64url, true);
  }
}
