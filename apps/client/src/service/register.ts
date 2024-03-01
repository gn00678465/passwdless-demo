import type { AxiosResponse } from "axios";

import { request } from "./request";
import { FetchedPublicKeyCredentialCreationOptions, ServiceResponse } from "../typings";
import type { RegistrationResponseJSON } from "@webauthn/types";

export async function startRegister(username: string) {
  return request.post<
    string,
    AxiosResponse<ServiceResponse<FetchedPublicKeyCredentialCreationOptions>>
  >("/api/v1/webauthn/registration", {
    username: username
  });
}

export async function finishRegister(data: RegistrationResponseJSON) {
  return request.put<string, AxiosResponse<any>>("/api/v1/webauthn/registration", { data });
}
