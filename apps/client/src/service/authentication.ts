import { AxiosResponse } from "axios";
import { request } from "./request";

import type { FatchedPublicKeyCredentialRequestOptions, ServiceResponse } from "../typings";
import type { AuthenticationResponseJSON } from "@webauthn/types";

export async function startAuth(username: string) {
  return request.post<
    string,
    AxiosResponse<ServiceResponse<FatchedPublicKeyCredentialRequestOptions>>
  >("/api/v1/webauthn/authentication", { username });
}

export async function finishAuth(data: AuthenticationResponseJSON) {
  return request.put("/api/v1/webauthn/authentication", { data });
}
