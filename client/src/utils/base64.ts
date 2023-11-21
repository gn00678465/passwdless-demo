export class Base64Url {
  constructor() {}

  static #toBuffer(text: string): ArrayBuffer {
    return Uint8Array.from(text, (c) => c.charCodeAt(0)).buffer;
  }

  static #parseBuffer(buffer: ArrayBuffer): string {
    return String.fromCharCode(...new Uint8Array(buffer));
  }

  static encodeBase64Url(buffer: ArrayBuffer): string {
    const text = btoa(this.#parseBuffer(buffer));
    return text.replace(/\+/g, '-').replace(/\//, '_');
  }

  static decodeBase64Url(base64url: string): ArrayBuffer {
    const text = base64url.replace(/-/g, '+').replace(/_/, '/');
    return this.#toBuffer(atob(text));
  }

  static isBase64Url(base64url: string): boolean {
    return base64url.match(/^[a-zA-Z0-9\-_]+=*$/) !== null;
  }
}
