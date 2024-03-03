export interface AuthenticatorDevice {
  id: number;
  credential_id: string;
  username: string;
  public_key: string;
  counter: number;
  transports: string;
}
