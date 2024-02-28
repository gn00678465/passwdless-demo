import { fromBase64URL, toArrayBuffer } from "../utils/base64";
import type { ClientDataJSON } from "../types/clientDataJSON.type";

export function decodeClientDataJSON(base64url: string): ClientDataJSON {
  const arraybuffer = toArrayBuffer(fromBase64URL(base64url));
  const utf8Decoder = new TextDecoder("utf-8");
  const json = JSON.parse(utf8Decoder.decode(arraybuffer));
  return json;
}
