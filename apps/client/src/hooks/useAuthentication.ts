import { useRef } from "react";
import { webauthnAuthentication } from "@webauthn/browser";
import type { WebauthnAuthenticationOptions } from "@webauthn/browser";
import { startAuth, finishAuth } from "../service/authentication";
import {
  Base64Url,
  PublicKeyCredentialAssertionAdapter,
  PublicKeyCredentialRequestOptionsTransform
} from "../utils";

export interface UseAuthenticationOptions<TR>
  extends Pick<
    WebauthnAuthenticationOptions<TR>,
    "onSuccess" | "onComplete" | "onError" | "signal"
  > {
  attachment?: WebAuthnClientType.Attachment;
}

export function useAuthentication<TR>(
  username: string,
  { attachment, signal, onComplete, onSuccess, onError }: UseAuthenticationOptions<TR>
) {
  async function authenticationStart() {
    await webauthnAuthentication({
      getPublicKeyRequestOptions: async () => {
        const res = await startAuth(username);
        return new PublicKeyCredentialRequestOptionsTransform(res.data.data).options;
      },
      sendSignedChallenge: async (options) => {
        if (options) {
          const res = await finishAuth(new PublicKeyCredentialAssertionAdapter(options).toJson());
          return res.data;
        }
        return null;
      },
      onSuccess,
      onError,
      onComplete
    });
  }

  return { authenticationStart };
}
