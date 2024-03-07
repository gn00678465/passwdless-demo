import { startRegister, finishRegister } from "../service/registration";
import { webauthnRegistration, WebauthnRegistrationOptions } from "@webauthn/browser";
import {
  PublicKeyCredentialCreationOptionsTransform,
  PublicKeyCredentialAttestationAdapter
} from "../utils";
import type { RegistrationAdvanceState } from "./useRegistrationAdvance";

export interface UseRegistrationOptions<TR>
  extends Pick<WebauthnRegistrationOptions<TR>, "onSuccess" | "onComplete" | "onError" | "signal"> {
  params?: RegistrationAdvanceState;
}

export function useRegistration<TR>({
  signal,
  onComplete,
  onSuccess,
  onError,
  params = {}
}: UseRegistrationOptions<TR>) {
  async function handleRegistration(name: string) {
    await webauthnRegistration<TR>({
      getPublicKeyCreationOptions: async () => {
        const res = await startRegister({ username: name, params });
        if (res.data.status === "Success") {
          return new PublicKeyCredentialCreationOptionsTransform(res.data.data).options;
        }
        throw new Error(res.data.message);
      },
      sendSignedChallenge: async (credentials) => {
        if (credentials) {
          const res = await finishRegister(
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

  return { handleRegistration };
}
