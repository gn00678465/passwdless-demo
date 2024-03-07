import { passkeysAuthentication, WebauthnAuthenticationOptions, isCMA } from "@webauthn/browser";
import { omit } from "@passless-demo/utility";
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
  async function handlePasskeys(signal?: AbortSignal) {
    const isEnableCMA = await isCMA();
    await passkeysAuthentication({
      signal,
      getPublicKeyRequestOptions: async () => {
        const res = await startPasskeys({ params });
        if (res.data.status === "Success") {
          if (isEnableCMA) {
            const omitTimeout = omit(res.data.data, ["timeout", "allowCredentials"]);
            return new PublicKeyCredentialRequestOptionsTransform(omitTimeout).options;
          }
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

  return { handlePasskeys };
}
