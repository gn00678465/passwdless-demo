declare namespace Authenticate {
  interface PublicKeyCredentialAssert {
    id: string;
    rawId: string;
    authenticatorAttachment: string | null;
    type: 'public-key';
    response: {
      clientDataJSON: string;
      authenticatorData: string;
      signature: string;
      userHandle: string | null;
    };
    clientExtensionResults: AuthenticationExtensionsClientOutputs;
  }
}