export type AuthenticatorTransportFuture =
  | "ble"
  | "cable"
  | "hybrid"
  | "internal"
  | "nfc"
  | "smart-card"
  | "usb";

export interface PublicKeyCredentialDescriptorFuture
  extends Omit<PublicKeyCredentialDescriptor, "transports"> {
  transports?: AuthenticatorTransportFuture[];
}
