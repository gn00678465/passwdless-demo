import { AxiosResponse } from "axios";
import { request } from "./request";

import type { FatchedPublicKeyCredentialRequestOptions, ServiceResponse } from "../typings";
import type { AuthenticationResponseJSON } from "@webauthn/types";
import type { AuthenticationAdvanceState } from "../hooks";

export interface StartAuthOptions {
  username: string;
  params?: AuthenticationAdvanceState;
}

export async function startAuth({ username, params = {} }: StartAuthOptions) {
  return request.post<
    string,
    AxiosResponse<ServiceResponse<FatchedPublicKeyCredentialRequestOptions>>
  >("/api/v1/webauthn/authentication", { username, params });
}

export async function finishAuth(data: AuthenticationResponseJSON) {
  return request.put("/api/v1/webauthn/authentication", { data });
}
