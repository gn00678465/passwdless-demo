declare namespace Common {
  type AuthenticatorTransportFuture =
    | 'ble'
    | 'cable'
    | 'hybrid'
    | 'internal'
    | 'nfc'
    | 'smart-card'
    | 'usb';

  type AuthenticatorDevice = {
    credentialPublicKey: Uint8Array;
    credentialID: Uint8Array;
    // Number of times this authenticator is expected to have been used
    counter: number;
    // From browser's `startRegistration()` -> RegistrationCredentialJSON.transports (API L2 and up)
    transports?: AuthenticatorTransportFuture[];
  };
}
