import cbor from 'cbor';

import { Base64Url } from '../../utils';

export interface ParseAuthenticatorDataResult {}

export function parseAuthenticatorData(authenticatorData: string) {
  let authData = new Uint8Array(Base64Url.decodeBase64Url(authenticatorData));
  const dataView = new DataView(
    authData.buffer,
    authData.byteOffset,
    authData.length
  );

  if (authData.byteLength < 37) {
    throw new Error(
      `Authenticator data was ${authData.byteLength} bytes, expected at least 37 bytes`
    );
  }

  let pointer = 0;

  const rpIdHash = authData.slice(pointer, (pointer += 32));

  /* Flags */
  const flagsBuffer = authData.slice(pointer, (pointer += 1));

  const flagsInt = (flagsBuffer as any)[0] as number;
  // Bit positions can be referenced here:
  // https://www.w3.org/TR/webauthn-2/#flags
  const flags = {
    up: !!(flagsInt & (1 << 0)), // User Presence
    uv: !!(flagsInt & (1 << 2)), // User Verified
    be: !!(flagsInt & (1 << 3)), // Backup Eligibility
    bs: !!(flagsInt & (1 << 4)), // Backup State
    at: !!(flagsInt & (1 << 6)), // Attested Credential Data Present
    ed: !!(flagsInt & (1 << 7)), // Extension Data Present
    flagsInt
  };

  const counterBuffer = authData.slice(pointer, pointer + 4);
  const counter = dataView.getUint32(pointer, false);
  pointer += 4;

  /* Attested credential data */
  let aaguid: Uint8Array | undefined = undefined;
  let credentialId: Uint8Array | undefined = undefined;
  let credentialData: Uint8Array | undefined = undefined;

  if (flags.at) {
    aaguid = authData.slice(pointer, (pointer += 16));

    const credIdLen = dataView.getUint16(pointer);
    pointer += 2;

    credentialId = authData.slice(pointer, (pointer += credIdLen));
  }
}
