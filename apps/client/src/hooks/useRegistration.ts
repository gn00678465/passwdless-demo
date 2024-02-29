import { startRegister, finishRegister } from "../service/register";
import { webauthnRegistration, WebauthnRegistrationOptions } from "@webauthn/browser";
import {
  PublicKeyCredentialCreationOptionsTransform,
  PublicKeyCredentialAttestationAdapter
} from "../utils";

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
        const res = await startRegister(name);
        return new PublicKeyCredentialCreationOptionsTransform(res.data.data).options;
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
