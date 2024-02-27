import { fetchRegisterOptions, postRegister } from "../service/register";
import {
  isLocalAuthenticator,
  isCMA,
  createCredential,
  getSignature,
  webauthnRegistration,
  WebauthnRegistrationOptions
} from "@webauthn/browser";
import { PublicKeyOptions, Base64Url, PublicKeyCredentialAttestationAdapter } from "../utils";

export interface UseRegistrationOptions<TR>
  extends Pick<WebauthnRegistrationOptions<TR>, "onSuccess" | "onComplete" | "onError" | "signal"> {
  attachment?: WebAuthnClientType.Attachment;
}

export function useRegistration<TR>(
  name: string,
  { attachment, signal, onComplete, onSuccess, onError }: UseRegistrationOptions<TR>
) {
  async function registrationStart() {
    await webauthnRegistration<TR>({
      getPublicKeyCreationOptions: async () => {
        const {
          data: {
            data: { challenge, rpId, rpName, excludeCredentials }
          }
        } = await fetchRegisterOptions(name);
        const credential = new PublicKeyOptions(
          challenge,
          {
            id: crypto.getRandomValues(new Uint8Array(32)),
            name: name,
            displayName: name
          },
          rpId,
          rpName,
          {
            userVerification: "required",
            attestation: "direct",
            authenticatorAttachment: attachment,
            excludeCredentials: excludeCredentials.map(({ id, ...args }) => {
              return {
                id: Base64Url.decodeBase64Url(id),
                ...args
              } as PublicKeyCredentialDescriptor;
            })
          }
        ).publicKeyOptions;
        return credential;
      },
      sendSignedChallenge: async (credentials) => {
        if (credentials) {
          const res = await postRegister(
            name,
            new PublicKeyCredentialAttestationAdapter(credentials).toJson()
          );
          return res.data;
        }
        return null;
      },
      onSuccess,
      onError,
      onComplete,
      signal
    });
  }

  return { registrationStart };
}
