import type { AxiosResponse } from "axios";
import { request } from "./request";

import type { FatchedPublicKeyCredentialRequestOptions, ServiceResponse } from "../typings";
import type { AuthenticationResponseJSON } from "@webauthn/types";
import type { AuthenticationAdvanceState } from "../hooks";

export interface StartPassKeysOptions {
  params?: AuthenticationAdvanceState;
}

export async function startPasskeys({ params = {} }: StartPassKeysOptions) {
  return request.post<
    string,
    AxiosResponse<ServiceResponse<FatchedPublicKeyCredentialRequestOptions>>
  >("/api/v1/webauthn/passkeys", { params });
}

export async function finishPasskeys(data: AuthenticationResponseJSON) {
  return request.put("/api/v1/webauthn/passkeys", { data });
}
