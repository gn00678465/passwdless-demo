import type { AxiosResponse } from "axios";

import { request } from "./request";
import { PublicKeyCredentialAttestation } from "../webAuthnClient";
import { FetchedPublicKeyCredentialCreationOptions } from "../typings";

export async function startRegister(username: string) {
  return request.post<
    string,
    AxiosResponse<Service.SuccessfulResponse<FetchedPublicKeyCredentialCreationOptions>>
  >("/api/v1/webauthn/registration", {
    username: username
  });
}

export async function finishRegister(data: PublicKeyCredentialAttestation) {
  return request.put<string, AxiosResponse<any>>("/api/v1/webauthn/registration", { data });
}
