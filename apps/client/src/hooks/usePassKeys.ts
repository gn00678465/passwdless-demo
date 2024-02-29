import { useRef } from "react";
import {
  isLocalAuthenticator,
  isCMA,
  createCredential,
  getSignature,
  passkeysAuthentication,
  WebauthnAuthenticationOptions
} from "@webauthn/browser";
import { startPasskey, finishPasskey } from "../service/passleys";
import {
  Base64Url,
  PublicKeyCredentialAssertionAdapter,
  PublicKeyCredentialRequestOptionsTransform
} from "../utils";

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
        const res = await startPasskey();
        return new PublicKeyCredentialRequestOptionsTransform(res.data.data).options;
      },
      sendSignedChallenge: async (credential) => {
        if (credential) {
          const res = await finishPasskey(
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
