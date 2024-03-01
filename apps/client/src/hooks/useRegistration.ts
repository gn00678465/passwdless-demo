import { startRegister, finishRegister } from "../service/register";
import { webauthnRegistration, WebauthnRegistrationOptions } from "@webauthn/browser";
import {
  PublicKeyCredentialCreationOptionsTransform,
  PublicKeyCredentialAttestationAdapter
} from "../utils";

export interface UseRegistrationOptions<TR>
  extends Pick<WebauthnRegistrationOptions<TR>, "onSuccess" | "onComplete" | "onError" | "signal"> {
  attachment?: AuthenticatorAttachment | undefined;
}

export function useRegistration<TR>(
  name: string,
  { signal, onComplete, onSuccess, onError }: UseRegistrationOptions<TR>
) {
  async function registrationStart() {
    await webauthnRegistration<TR>({
      getPublicKeyCreationOptions: async () => {
        const res = await startRegister(name);
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

  return { registrationStart };
}
