import { AxiosResponse } from "axios";
import { request } from "./request";

import { PublicKeyCredentialAssert } from "../webAuthnClient";
import type { FatchedPublicKeyCredentialRequestOptions } from "../typings";

export async function startAuth(username: string) {
  return request.post<
    string,
    AxiosResponse<Service.SuccessfulResponse<FatchedPublicKeyCredentialRequestOptions>>
  >("/api/v1/webauthn/authentication", { username });
}

export async function finishAuth(data: PublicKeyCredentialAssert) {
  return request.put("/api/v1/webauthn/authentication", { data });
}
