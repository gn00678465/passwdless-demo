export interface Authenticator {
  id: number;
  credential_id: string;
  username: string;
  public_key: string;
  algorithm: string;
  transports: string;
}
