import { Base64Url } from '../../utils';

export interface ClientDataJson {
  challenge: string;
  origin: string;
  type: 'webauthn.create' | 'webauthn.get' | (string & {});
  crossOrigin?: boolean;
  tokenBinding?: {
    id?: string;
    status: 'present' | 'supported' | 'not-supported';
  };
}

export function decodeClientDataJSON(clientData: string): ClientDataJson {
  const utf8Decoder = new TextDecoder('utf-8');
  const decodedClientData = utf8Decoder.decode(
    Base64Url.decodeBase64Url(clientData)
  );
  const clientDataObj = JSON.parse(decodedClientData);
  return clientDataObj as ClientDataJson;
}
