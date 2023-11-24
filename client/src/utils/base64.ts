export class Base64Url {
  constructor() {}

  static #toBuffer(binary: string): ArrayBuffer {
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return buffer;
  }

  static #toBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let str: string = '';

    for (const charCode of bytes) {
      str += String.fromCharCode(charCode);
    }

    return btoa(str);
  }

  static encodeBase64Url(buffer: ArrayBuffer): string {
    const text = this.#toBase64(buffer);
    return text.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  static decodeBase64Url(base64url: string): ArrayBuffer {
    const text = base64url.replace(/-/g, '+').replace(/_/, '/');
    const padLength = (4 - (text.length % 4)) % 4;
    const base64 = text.padEnd(text.length + padLength, '=');
    return this.#toBuffer(atob(base64));
  }

  static isBase64Url(base64url: string): boolean {
    return base64url.match(/^[a-zA-Z0-9\-_]+=*$/) !== null;
  }
}
