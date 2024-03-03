import type { AxiosResponse } from "axios";

import { request } from "./request";
import { FetchedPublicKeyCredentialCreationOptions, ServiceResponse } from "../typings";
import type { RegistrationResponseJSON } from "@webauthn/types";
import type { RegistrationAdvanceState } from "../hooks";

export interface StartRegisterOptions {
  username: string;
  params?: RegistrationAdvanceState;
}

export async function startRegister({ username, params = {} }: StartRegisterOptions) {
  return request.post<
    string,
    AxiosResponse<ServiceResponse<FetchedPublicKeyCredentialCreationOptions>>
  >("/api/v1/webauthn/registration", {
    username,
    params
  });
}

export async function finishRegister(data: RegistrationResponseJSON) {
  return request.put<string, AxiosResponse<any>>("/api/v1/webauthn/registration", { data });
}
