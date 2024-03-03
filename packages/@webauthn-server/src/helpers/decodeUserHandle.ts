import { fromBase64URL, toArrayBuffer } from "../utils/base64";

export function decodeUserHandle(base64url: string): string {
  const arraybuffer = toArrayBuffer(fromBase64URL(base64url));
  const utf8Decoder = new TextDecoder("utf-8");
  return utf8Decoder.decode(arraybuffer);
}
