import { useRef } from "react";
import {
  isLocalAuthenticator,
  isCMA,
  createCredential,
  getSignature,
  passkeysAuthentication,
  WebauthnAuthenticationOptions
} from "@webauthn/browser";
import { fetchPasskeysOptions, sendPasskeysSignature } from "../service/passleys";
import { PublicKeyRequestOptions, Base64Url, PublicKeyCredentialAssertionAdapter } from "../utils";

export interface UsePassKeysOptions<TR>
  extends Pick<WebauthnAuthenticationOptions<TR>, "onSuccess" | "onComplete" | "onError"> {
  attachment?: WebAuthnClientType.Attachment;
}

export function usePassKeys<TR = unknown>({
  attachment,
  onComplete,
  onSuccess,
  onError
}: UsePassKeysOptions<TR>) {
  const error = useRef<string | null>(null);
  const abortController = useRef<null | AbortController>(null);

  async function passkeysAuthStart() {
    await passkeysAuthentication({
      signal: abortController.current?.signal,
      getPublicKeyRequestOptions: async () => {
        abortController.current = new AbortController();
        const {
          data: {
            data: { challenge, rpId, allowCredentials }
          }
        } = await fetchPasskeysOptions();
        const credential = new PublicKeyRequestOptions(challenge, rpId, {
          allowCredentials: allowCredentials.map(({ id, ...args }) => {
            return {
              id: Base64Url.decodeBase64Url(id),
              ...args
            } as PublicKeyCredentialDescriptor;
          })
        }).publicKeyRequestOptions;
        return credential;
      },
      sendSignedChallenge: async (credential) => {
        if (credential) {
          const res = await sendPasskeysSignature(
            new PublicKeyCredentialAssertionAdapter(credential).toJson()
          );
          return res.data;
        }
        return null;
      },
      onSuccess,
      onComplete
    });
  }

  function abort() {
    abortController.current?.abort();
  }

  return { passkeysAuthError: error, passkeysAuthStart, passkeysAuthAbort: abort };
}
