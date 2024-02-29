import base64 from "@hexagon/base64";

export const uint8ArrayToBase64 = (uint8Array: Uint8Array): string =>
  Buffer.from(uint8Array).toString("base64");

export const base64ToUint8Array = (base64: string): Uint8Array =>
  new Uint8Array(Buffer.from(base64, "base64"));

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
