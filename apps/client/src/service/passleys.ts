import type { AxiosResponse } from "axios";
import { request } from "./request";

import { PublicKeyCredentialAssert } from "../webAuthnClient";
import type { FatchedPublicKeyCredentialRequestOptions } from "../typings";

export async function startPasskey() {
  return request.post<
    unknown,
    AxiosResponse<Service.SuccessfulResponse<FatchedPublicKeyCredentialRequestOptions>>
  >("/api/v1/webauthn/passkeys");
}

export async function finishPasskey(data: PublicKeyCredentialAssert) {
  return request.put("/api/v1/webauthn/passkeys", { data });
}
