import { encode, decode } from "base64-arraybuffer-es6";

export function toArrayBuffer(base64: string) {
  return decode(base64);
}

export function fromBase64URL(base64url: string): string {
  return (base64url + "===".slice((base64url.length + 3) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
}

export function toBase64URL(base64: string): string {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
