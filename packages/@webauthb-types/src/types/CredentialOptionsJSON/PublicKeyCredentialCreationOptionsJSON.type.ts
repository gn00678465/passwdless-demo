import { AuthenticatorTransportFuture } from "./AuthenticatorTransportFuture.type";

export interface PublicKeyCredentialDescriptorFuture
  extends Omit<PublicKeyCredentialDescriptor, "transports"> {
  transports?: AuthenticatorTransportFuture[];
}
