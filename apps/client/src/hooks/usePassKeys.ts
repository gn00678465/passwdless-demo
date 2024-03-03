import { useRef } from "react";
import { passkeysAuthentication, WebauthnAuthenticationOptions } from "@webauthn/browser";
import { startPasskeys, finishPasskeys } from "../service/passleys";
import {
  PublicKeyCredentialAssertionAdapter,
  PublicKeyCredentialRequestOptionsTransform
} from "../utils";
import type { AuthenticationAdvanceState } from "./useAuthenticationAdvance";

export interface UsePassKeysOptions<TR>
  extends Pick<WebauthnAuthenticationOptions<TR>, "onSuccess" | "onComplete" | "onError"> {
  params?: AuthenticationAdvanceState;
}

export function usePassKeys<TR = unknown>({
  params = {},
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
        const res = await startPasskeys({ params });
        if (res.data.status === "Success") {
          return new PublicKeyCredentialRequestOptionsTransform(res.data.data).options;
        }
        throw new Error(res.data.message);
      },
      sendSignedChallenge: async (credential) => {
        if (credential) {
          const res = await finishPasskeys(
            new PublicKeyCredentialAssertionAdapter(credential).toJson()
          );
          return res.data;
        }
        return null;
      },
      onSuccess,
      onError,
      onComplete
    });
  }

  function abort() {
    abortController.current?.abort();
  }

  return { passkeysAuthError: error, passkeysAuthStart, passkeysAuthAbort: abort };
}
