import type { AxiosResponse } from "axios";
import { request } from "./request";

import type { FatchedPublicKeyCredentialRequestOptions, ServiceResponse } from "../typings";
import type { AuthenticationResponseJSON } from "@webauthn/types";

export async function startPasskey() {
  return request.post<
    unknown,
    AxiosResponse<ServiceResponse<FatchedPublicKeyCredentialRequestOptions>>
  >("/api/v1/webauthn/passkeys");
}

export async function finishPasskey(data: AuthenticationResponseJSON) {
  return request.put("/api/v1/webauthn/passkeys", { data });
}
