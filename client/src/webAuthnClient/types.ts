type PublicKeyCredentialAttestationKeys =
  | 'credential_id'
  | 'public_key'
  | 'username'
  | 'authenticatorData'
  | 'clientData'
  | 'algorithm';

export type PublicKeyCredentialAttestation = Record<
  PublicKeyCredentialAttestationKeys,
  string
> & { transports: string[] };

type PublicKeyCredentialAssertKeys =
  | 'credential_id'
  | 'authenticatorData'
  | 'clientData'
  | 'signature';

export type PublicKeyCredentialAssert = Record<
  PublicKeyCredentialAssertKeys,
  string
> & { userHandle: string | null };
